export {};

const knex = require('./connection');

/*
    Use: Adds a recording to the database.
    Params: signed url, recording type, s3 key, profile id
*/
function addRecording(recordingLink: string, recordingType: number, key: string, profileId: number) {

  return knex("recordings")
    .insert({
      recording_link: recordingLink,
      recording_type_id: recordingType,
      aws_s3_key: key,
      profile_id: profileId
    })
    .returning("*")
    .then((rows:any) => {
      return rows[0];
    });
}

/*
    Use: Gets recording of a specific type associated with a profile id.
    Params: recording type, profile id.
*/
function getRecordings(recordingType: number, profileId: string) {

    return knex("recordings")
        .select("recording_link", "aws_s3_key", "date_created")
        .where( function (this:any) {
          this.where("profile_id", profileId)
          .andWhere("recording_type_id", recordingType);
        })
        .then((recordings: any) => {
            return recordings;
        });
}

module.exports = {
  addRecording,
  getRecordings
}
