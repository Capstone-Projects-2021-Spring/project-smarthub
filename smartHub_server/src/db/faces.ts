export {};

const knex = require('./connection');

function addFace(name: string, faceData: string, profileId: number) {

  return knex("faces")
    .insert({
      face_name: name,
      face_data: faceData,
      profile_id: profileId
    })
    .returning("*")
    .then((rows:any) => {
      return rows[0];
    });
}

function getFaces(profileId: number) {
    return knex("faces")
        .select("face_data")
        .where("profile_id", profileId)
        .then((rows: any) => {
            return rows;
        });
}

module.exports = {
  addFace,
  getFaces
}
