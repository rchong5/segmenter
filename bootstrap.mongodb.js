/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('segmenter');





db.getCollection("staff").insertMany([
  {
    _id: UUID("9050477f-55ae-4e6a-8968-316065eeeff7"),
    "name": "Jill",
    "projects": [UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd")],
    "imgs": [UUID("53c2e409-389c-4a9d-9f97-616c58a3f24f")],
    "annotations": [UUID("b8dc0730-f8f1-4280-b9c6-c1b7d52ca44d"), UUID("0d88f764-2cf7-4c77-b1e8-e27eca7cc4eb")]
  },
  {
    _id: UUID("d46bf151-7d4d-4d75-b9ff-d8223acbf2a0"),
    "name": "Jack",
    "projects": [UUID("25322e48-8a91-4d9d-886c-b74aa2de9f86")],
    "imgs": [UUID("3f7d1d1c-c14e-4b5c-aab3-4ba81839c499")],
    "annotations": [UUID("178cb145-53e3-417a-9ae0-cf0eca9aafc5"), UUID("a928bc70-2946-4910-8e2a-1bebe3c453ff")]
  },
]);





db.getCollection("projects").insertMany([
  {
    _id: UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd"),
    "name": "kittens",
    "annotated": 50,
    "annotators": [UUID("9050477f-55ae-4e6a-8968-316065eeeff7")],
    "imgs": [UUID("53c2e409-389c-4a9d-9f97-616c58a3f24f"), UUID("f8899e82-aa6b-489c-876e-2b2d400b9454")],
    "annotations": [UUID("b8dc0730-f8f1-4280-b9c6-c1b7d52ca44d"), UUID("0d88f764-2cf7-4c77-b1e8-e27eca7cc4eb")]
  },
  {
    _id: UUID("25322e48-8a91-4d9d-886c-b74aa2de9f86"),
    "name": "puppies",
    "annotated": 100,
    "annotators": [UUID("d46bf151-7d4d-4d75-b9ff-d8223acbf2a0")],
    "imgs": [UUID("3f7d1d1c-c14e-4b5c-aab3-4ba81839c499")],
    "annotations": [UUID("178cb145-53e3-417a-9ae0-cf0eca9aafc5"), UUID("a928bc70-2946-4910-8e2a-1bebe3c453ff")]
  },
]);





db.getCollection("imgs").insertMany([
  {
    _id: UUID("53c2e409-389c-4a9d-9f97-616c58a3f24f"),
    "URL": "https://aquitainevet.com/wp-content/uploads/2018/06/aquitaine-kittens.jpg",
    "projects": [UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd")],
    "annotators": [UUID("9050477f-55ae-4e6a-8968-316065eeeff7")],
    "annotations": [UUID("b8dc0730-f8f1-4280-b9c6-c1b7d52ca44d"), UUID("0d88f764-2cf7-4c77-b1e8-e27eca7cc4eb")]
  },
  {
    _id: UUID("3f7d1d1c-c14e-4b5c-aab3-4ba81839c499"),
    "URL": "https://cdn.britannica.com/55/164255-050-AAADAF11/litter-Australian-Shepherd-puppies.jpg",
    "projects": [UUID("25322e48-8a91-4d9d-886c-b74aa2de9f86")],
    "annotators": [UUID("d46bf151-7d4d-4d75-b9ff-d8223acbf2a0")],
    "annotations": [UUID("178cb145-53e3-417a-9ae0-cf0eca9aafc5"), UUID("a928bc70-2946-4910-8e2a-1bebe3c453ff")]
  },
  {
    _id: UUID("f8899e82-aa6b-489c-876e-2b2d400b9454"),
    "URL": "https://www.cats.org.uk/media/12883/210908ncac104.jpg",
    "projects": [UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd")],
    "annotators": [],
    "annotations": []
  },
]);





db.getCollection("annotations").insertMany([
  {
    _id: UUID("b8dc0730-f8f1-4280-b9c6-c1b7d52ca44d"),
    "annotators": [UUID("9050477f-55ae-4e6a-8968-316065eeeff7")],
    "img": UUID("53c2e409-389c-4a9d-9f97-616c58a3f24f"),
    "projects": [UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd")],
    "label": "meow",
    "area": 1238,
    "points": [{"x": 70, "y": 125}, {"x": 80, "y": 140}, {"x": 100, "y": 155}, {"x": 80, "y": 200}, {"x": 65, "y": 155}]
  },
  {
    _id: UUID("0d88f764-2cf7-4c77-b1e8-e27eca7cc4eb"),
    "annotators": [UUID("9050477f-55ae-4e6a-8968-316065eeeff7")],
    "img": UUID("53c2e409-389c-4a9d-9f97-616c58a3f24f"),
    "projects": [UUID("bc5396ab-d72f-4f01-b995-f2af6bf87ecd")],
    "label": "litter",
    "area": 2475,
    "points": [{"x": 140, "y": 145}, {"x": 160, "y": 160}, {"x": 200, "y": 175}, {"x": 160, "y": 220}, {"x": 130, "y": 175}]
  },
  {
    _id: UUID("178cb145-53e3-417a-9ae0-cf0eca9aafc5"),
    "annotators": [UUID("d46bf151-7d4d-4d75-b9ff-d8223acbf2a0")],
    "img": UUID("3f7d1d1c-c14e-4b5c-aab3-4ba81839c499"),
    "projects": [UUID("25322e48-8a91-4d9d-886c-b74aa2de9f86")],
    "label": "arf",
    "area": 1063,
    "points": [{"x": 40, "y": 105}, {"x": 50, "y": 120}, {"x": 70, "y": 135}, {"x": 50, "y": 170}, {"x": 35, "y": 135}]
  },
  {
    _id: UUID("a928bc70-2946-4910-8e2a-1bebe3c453ff"),
    "annotators": [UUID("d46bf151-7d4d-4d75-b9ff-d8223acbf2a0")],
    "img": UUID("3f7d1d1c-c14e-4b5c-aab3-4ba81839c499"),
    "projects": [UUID("25322e48-8a91-4d9d-886c-b74aa2de9f86")],
    "label": "ball",
    "area": 3188,
    "points": [{"x": 120, "y": 165}, {"x": 150, "y": 180}, {"x": 210, "y": 195}, {"x": 150, "y": 230}, {"x": 105, "y": 195}]
  },
]);





/*
{
    "annotator": "d46bf151-7d4d-4d75-b9ff-d8223acbf2a0",
    "img": "53c2e409-389c-4a9d-9f97-616c58a3f24f",
    "project": "bc5396ab-d72f-4f01-b995-f2af6bf87ecd",
    "label": "feather",
    "points": [{"x": 290, "y": 310}, {"x": 460, "y": 475}, {"x": 500, "y": 490}, {"x": 460, "y": 535}, {"x": 280, "y": 340}]
}
*/


/*
{
    "annotation": "0d88f764-2cf7-4c77-b1e8-e27eca7cc4eb",
    "annotators": ["9050477f-55ae-4e6a-8968-316065eeeff7", "d46bf151-7d4d-4d75-b9ff-d8223acbf2a0"],
    "img": "53c2e409-389c-4a9d-9f97-616c58a3f24f",
    "projects": ["bc5396ab-d72f-4f01-b995-f2af6bf87ecd"],
    "label": "litter",
    "points": [{"x": 140, "y": 145}, {"x": 170, "y": 150}, {"x": 200, "y": 175}, {"x": 210, "y": 220}, {"x": 225, "y": 100}, {"x": 200, "y": 105}, {"x": 150, "y": 125}]
}
*/