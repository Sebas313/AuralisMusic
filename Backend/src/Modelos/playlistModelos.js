import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    creadoPor:{type:mongoose.Schema.Types.ObjectId, ref:"Usuario", required:true},
    canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Canciones" }],
    nombre:String,
    
});

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
