// import mongoose from 'mongoose';

// const UsersSchema = new mongoose.Schema({
//     orgCode: { type: String, required: true },
//     username: { type: String, required: true },
//     password: { type: String, required: true }, // Ideally use bcrypt
//     vendorId: { type: Number, required: true },
//     productId: { type: Number, required: true }
// });

// export const users = mongoose.model('users', UsersSchema);

  

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    orgCode: String,
    username: String,
    password: String,
    vendorId: Number,
    productId: Number,
    serialNumber: String // Optional for strict validation
});

export const users = mongoose.model('users', userSchema);
