const {model, Schema} = require('mongoose');

let staffSchema = new Schema({
    Guild: String
});

module.exports = model("staff", staffSchema);