# segmenter API Data Model

## staff documents
| Field | Type | Description |
| ----------- | ----------- | ----------- |
| _id | BSON | UUID of this specific staff document |
| name | String | name of the staff member/annotator |
| projects | Array of BSON | array of BSON UUIDs of project documents associated with this staff member |
| imgs | Array of BSON | array of BSON UUIDs of img documents associated with this staff member |
| annotations | Array of BSON | array of BSON UUIDs of annotation documents associated with this staff member |

## project documents
| Field | Type | Description |
| ----------- | ----------- | ----------- |
| _id | BSON | UUID of this specific project document |
| name | String | name of the project |
| annotated | Int32 | percentage of imgs associated with this project that have at least one annotation (values from 0 to 100) |
| annotators | Array of BSON | array of BSON UUIDs of annotator documents associated with this project |
| imgs | Array of BSON | array of BSON UUIDs of img documents associated with this project |
| annotations | Array of BSON | array of BSON UUIDs of annotation documents associated with this project |

## img documents
| Field | Type | Description |
| ----------- | ----------- | ----------- |
| _id | BSON | UUID of this specific img document |
| URL | String | URL to where this img is stored |
| projects | Array of BSON | array of BSON UUIDs of project documents associated with this img |
| annotators | Array of BSON | array of BSON UUIDs of annotator documents associated with this img |
| annotations | Array of BSON | array of BSON UUIDs of annotation documents associated with this img |

## annotation documents
| Field | Type | Description |
| ----------- | ----------- | ----------- |
| _id | BSON | UUID of this specific annotation document |
| annotators | Array of BSON | array of BSON UUIDs of annotator documents associated with this annotation |
| img | BSON | BSON UUID of the img document associated with this annotation |
| projects | Array of BSON | array of BSON UUIDs of project documents associated with this annotation |
| label | String | custom human-readable reference to this annotation |
| area | Int32 or Double | calculated area of this annotation's polygon |
| points | Array of dictionary Objects each containing two Int32 values | array of points for this annotation's polygon - example => [{x: 0, y: 0}, {x: 5, y: 5}, {x: 0, y: 10}] |

## Model design notes
The model was designed with a lattice structure of references.  Each individual document contains UUID references to all other related documents in the database.  This referential-lattice trades off more write operations on inserts/updates in exchange for mitigating join operations and subsequent cross-reference queries.