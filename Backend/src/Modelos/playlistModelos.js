import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    creadoPor:{type:mongoose.Schema.Types.ObjectId, ref:"Usuario", requiered:true},
    canciones:[{type:mongoose.Schema.types.ObjectId, ref:"Canciones"}],
    nombre:String,
    descripcion:String,
});

const playList = mongoose.model("playList", playlistSchema)

export default playList;