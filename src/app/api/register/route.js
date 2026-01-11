import { NextResponse } from "next/server";
<<<<<<< HEAD
import { connectDB } from "@/lib/mongodb";
import Apprentice from "@/models/Apprentice";
import cloudinary from "@/lib/cloudinary";
=======
import Apprentice from "@/models/Apprentice";
import { connectDB } from "@/config/db";
>>>>>>> f97d98ec7c970ca40f958fc6c642dc7f5f2e36bd

export async function POST(req) {
  try {
    await connectDB();

    const form = await req.formData();

    // Apprentice fields
    const fullName = form.get("fullName");
    const age = form.get("age");
    const gender = form.get("gender");
    const phone = form.get("phone");
    const address = form.get("address");
    const skill = form.get("skill");
    const startDate = form.get("startDate");

    // Guardian fields
    const guardianName = form.get("guardianName");
    const relationship = form.get("relationship");
    const guardianPhone = form.get("guardianPhone");
    const guardianAddress = form.get("guardianAddress");

    // Passport Upload
    const passportFile = form.get("passport");
    let passportUrl = null;

    if (passportFile && passportFile.size > 0) {
      const bytes = await passportFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
<<<<<<< HEAD
          .upload_stream(
            { folder: "apprentice_passports" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
=======
          .upload_stream({ folder: "apprentice_passports" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
>>>>>>> f97d98ec7c970ca40f958fc6c642dc7f5f2e36bd
          .end(buffer);
      });

      passportUrl = uploadResult.secure_url;
    }

    // Save to MongoDB
    await Apprentice.create({
      fullName,
      age,
      gender,
      phone,
      address,
      skill,
      startDate,
      passport: passportUrl,
      guardian: {
        name: guardianName,
        relationship,
        phone: guardianPhone,
        address: guardianAddress,
      },
    });

<<<<<<< HEAD
    return NextResponse.json({ message: "Apprentice registered successfully!" });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
=======
    return NextResponse.json({
      message: "Apprentice registered successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
>>>>>>> f97d98ec7c970ca40f958fc6c642dc7f5f2e36bd
  }
}
