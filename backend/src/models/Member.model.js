import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    employeeId: {type: String, required: true, unique: true},
    name: {type:String, required: true},
    password: {type:String, required:true, select: false},
    spot : {type:mongoose.Schema.Types.ObjectId, ref:"Spot", required:true},
    spotId: {type: Number, required:true},
    batch: {type:Number, enum: [1,2], required: true},
    seatNumber: {type:Number, required: true, min:1, max: 8},
}, {timestamps: true});

memberSchema.virtual("designatedSeat").get(function designatedSeatGetter() {
    const spotLabel = String.fromCharCode(64 + this.spotId);
    return `Spot ${spotLabel}-S${this.seatNumber}`;
});

memberSchema.set("toJSON", { virtuals: true });
memberSchema.set("toObject", { virtuals: true });

export const Member= mongoose.model("Member", memberSchema);
