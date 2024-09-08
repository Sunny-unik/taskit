import { connectDb } from "@/helper/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  let users = [];
  try {
    await connectDb();
    users = await User.find().select("-password");
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "failed to get users",
      success: false,
    });
  }

  return NextResponse.json(users);
}

export async function POST(request) {
  // extract user detail from  request
  const { name, email, password, about, profileURL } = await request.json();

  try {
    // create user object with user model
    const user = new User({
      name,
      email,
      password,
      profileURL,
    });

    // save the object to  database
    user.password = bcrypt.hashSync(
      user.password,
      parseInt(process.env.BCRYPT_SALT)
    );

    await connectDb();
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.code === 11000
            ? "Entered email is already registered"
            : "failed to create user !!",
        status: false,
      },
      { status: 500 }
    );
  }
}
