const mongoose=require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const roomConnection = mongoose.createConnection(process.env.mongodb_room)
const roomSchema = new mongoose.Schema({
  roomid: {
    type: Number,
    required: true,
    unique: true,
  },
  players: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.length <= 2;
      },
      message: "Only up to 2 players allowed in a room"
    }
  }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;