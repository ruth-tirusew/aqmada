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
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive [Your App Name] Preview</title>
    <style>
            .logo-con {
              display: flex;
              justify-self: center;
            }
            .logo{
                width: 200px; 
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
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .header{
            font-weight: 600;
            font-size: medium;
            text-align: center;
        }
        /* Add more styles as needed */
    </style>
</head>
<body>
    <div class="container">
        <div  class="logo" >
            <img src="https://res.cloudinary.com/ddbdbuuqw/image/upload/v1714507511/aqmada-01_kg33nv.png" class="logo"/>
          </div>
          <div class="email-content">
            <p class="header">
                Thank you for registering as a beta tester, 
            </p>
            <p>
              We are excited to invite you to participate as a beta tester for our groundbreaking platform Aqmada. Your expertise and feedback are invaluable to us as we refine and enhance our offering before its official launch.
            </p>
            <p>
              We greatly appreciate your commitment and dedication to helping us create an exceptional user experience. To get started click on this  credentials below:
            </p>
            <p>
            <a href="dashboard.aqmada.com">dashboard.aqmada.com</a>
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
            <p>
              The Perbytes Team
              </p>
            </p>
          </div>
    </div>
</body>
</html>
      
        `;;

        const amharic_mail = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive [Your App Name] Preview</title>
    <style>
            .logo-con {
              display: flex;
              justify-self: center;
            }
            .logo{
                width: 200px; 
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
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .header{
            font-weight: 600;
            font-size: medium;
            text-align: center;
        }
        /* Add more styles as needed */
    </style>
</head>
<body>
    <div class="container">
        <div  class="logo" >
            <img src="https://res.cloudinary.com/ddbdbuuqw/image/upload/v1714507511/aqmada-01_kg33nv.png" class="logo"/>
          </div>
          <div class="email-content">
            <p class="header">
                ስለተመዘገቡ እናመሰግናለን
            </p>
            <p>
                በአክማዳ ላይ ከመጀመሪያ ተጠቃሚዎቻችን መካከል እርስዎን በማግኘታችን ጓጉተናል። በይፋ ከመጀመሩ በፊት የእኛን አቅርቦት በማጣራት እና በማበልጸግ የእርስዎ እውቀት እና አስተያየት ለእኛ ጠቃሚ ናቸው።
            </p>
            <p>
            ልዩ የተጠቃሚ ተሞክሮ እንድንፈጥር ለመርዳት ያላችሁን ቁርጠኝነት እና ትጋት እናደንቃለን። ለመጀመር፣ እባክዎ ከታች የቀረበውን ኢሜል እና የይለፍ ቃል ይጠቀሙ
            </p>
            <p>
            <a href="dashboard.aqmada.com">dashboard.aqmada.com</a>
          </p>
            <p>
              <strong>ኢሜል:</strong> ${newUser.email}
            </p>
            <p>
              <strong>የይለፍ ቃል:</strong> ${password}
            </p>
            
            <p>
                ከሰላምታ ጋር፣
            <p>
            ፐርባይስ
              </p>
            </p>
          </div>
    </div>
</body>
</html>
      `;
    
        await sendEmail(waitlist.email, mail);
        setTimeout(async()=>{
            await sendEmail(waitlist.email, amharic_mail)
        }, 36000)
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