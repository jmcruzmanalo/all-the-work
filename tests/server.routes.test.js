const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { MainGuildID } = require('../config');
const { dropAllRequestRoleUpdate } = require('../actions/roles/roles.edit');
const config = require('./test.config');

describe(`server.routes.js`, () => {
  if (!config.routes) return;
  const { app } = require('..');

  before(async () => {
    await dropAllRequestRoleUpdate();
  });

  it(`should add a requestUpdateRolesRating`, async () => {
    await request(app)
      .post(`/api/servers/${MainGuildID}/requestUpdateRolesRating`)
      .send({
        ratingType: 'TRN Rating',
        trnRangeNames: ['Doodoo', 'Kouhai', 'Senpapi'],
        trnRange: [
          {
            min: 0,
            max: 2000
          },
          {
            min: 2001,
            max: 3500
          },
          {
            min: 3501,
            max: 5000
          }
        ]
      })
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe(
          'Request to update roles rating saved. Waiting for approval.'
        );
      });
  });
});
