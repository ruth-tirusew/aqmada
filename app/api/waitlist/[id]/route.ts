import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import bcrypt from "bcrypt";
import { sendEmail } from "@/app/lib/utils/mailer";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = getCurrentUser()
        const { id } = params
        const waitlist = await db.waitlist.delete({
            where: {
                id: id
            }
        })


        return NextResponse.json({
            message: "Waitlisted User deleted successfully",
            data: waitlist
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()
        console.log(process.env.EMAIL);
        console.log(process.env.PASSWORD);
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!user?.isSuperuser){
            return new NextResponse("User doesn't have required permissions", { status: 403 });
        }
        
        // Random password 8 characters long
        const password  = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(password, 12);

        const { id } = params

        const waitlist = await db.waitlist.update({
            where: {
                id: id
            },
            data: {
               approved: true
            }
        })

        const newUser = await db.user.create({
            data:{
                email: waitlist.email,
                password: hashedPassword
            }
        })

        const mail = `
        <html>
        <head>
          <style>
            .logo {
              width: 150px; 
            }
            .email-content {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
            }
            h1 {
              font-size: 24px;
            }
            p {
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div>
            <img src="https://res.cloudinary.com/ddbdbuuqw/image/upload/v1714507511/aqmada-01_kg33nv.png" class="logo" />
          </div>
          <div class="email-content">
            <p>
              We are excited to invite you to participate as a beta tester for our groundbreaking platform Aqmada. Your expertise and feedback are invaluable to us as we refine and enhance our offering before its official launch.
            </p>
            <p>
              We greatly appreciate your commitment and dedication to helping us create an exceptional user experience. To get started, please find your unique beta testing credentials below:
            </p>
            <p>
              <strong>Email:</strong> ${newUser.email}
            </p>
            <p>
              <strong>Password:</strong> ${password}
            </p>
            <p>Please note that these credentials are confidential and should not be shared with anyone else. They are solely for your personal use during the beta testing phase.</p>
            <p>
              Best regards,
            </p>
            <p>
              The Perbytes Team
            </p>
          </div>
        </body>
      </html>
      
        `;
    
        await sendEmail(waitlist.email, mail);
        return NextResponse.json({
            message: "Waitlisted User approved successfully",
            data: waitlist
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
}