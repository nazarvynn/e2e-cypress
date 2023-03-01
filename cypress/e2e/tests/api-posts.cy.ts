import { faker } from '@faker-js/faker';

// https://fakerjs.dev/
// $ yarn add @faker-js/faker --dev
// $ yarn add @types/faker -D

const apiPosts = `http://localhost:4200/api/posts`;

describe('Users API', () => {
  context('GET /api/posts', () => {
    it('gets a list of posts', () => {
      cy.request('GET', apiPosts).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(100);
      });
    });
  });

  context('GET /api/posts/:postId', () => {
    it('get a post', () => {
      cy.request('GET', `${apiPosts}/1`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({
          userId: 1,
          id: 1,
          title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
        });
      });
    });

    it('error when invalid postId', function () {
      cy.request({ method: 'GET', url: `${apiPosts}/1234`, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.deep.equal({});
      });
    });
  });

  context('POST /users', () => {
    it('creates a new user', () => {
      const newUser = {
        userId: 1,
        title: faker.lorem.sentences(),
        body: faker.lorem.text(),
      };

      cy.request('POST', apiPosts, newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.deep.equal({ id: 101, ...newUser });
      });
    });

    it('error when invalid field sent', () => {
      const invalidUser = {
        notAUserField: 'not a user field',
      };

      cy.request({
        method: 'POST',
        url: apiPosts,
        failOnStatusCode: false,
        body: invalidUser,
      }).then((response) => {
        expect(response.status).to.eq(201); // Should be "422"
        expect(response.body).to.deep.equal({ id: 101, notAUserField: 'not a user field' });
        // expect(response.body.errors.length).to.eq(1);
      });
    });
  });
});
