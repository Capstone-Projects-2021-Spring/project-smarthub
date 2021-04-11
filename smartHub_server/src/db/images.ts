export {};

const knex = require('./connection');

function addImage(imageName: string, imageLink: string, imageType: number, key: string, profileId: number) {

  return knex("images")
    .insert({
      image_name: imageName,
      image_link: imageLink,
      image_type_id: imageType,
      aws_s3_key: key,
      profile_id: profileId
    })
    .returning("*")
    .then((rows:any) => {
      return rows[0];
    });
}

function getImages(imageType: number, profileId: string) {

    return knex("images")
        .select("image_name", "image_link", "aws_s3_key", "date_created")
        .where( function (this:any) {
          this.where("profile_id", profileId)
          .andWhere("image_type_id", imageType);
        })
        .then((images: any) => {
            return images;
        });
}

function deleteImage(imageName: string, profileId: string) {
  return knex("images")
      .where( function (this:any) {
        this.where("profile_id", profileId)
        .andWhere("image_name", imageName);
      })
      .del()
      .then((rows: any) => {
          return rows;
      });
}

module.exports = {
  addImage,
  getImages,
  deleteImage
}
