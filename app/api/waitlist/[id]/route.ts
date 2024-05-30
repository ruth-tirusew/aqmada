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
                Thank you for your patience, 
            </p>
            <p>Due to unprecedented technical difficulties, the testing of our product had to be delayed. Due to unprecedented technical difficulties, the testing of our product had to be delayed</p>
            <p>
            We are sorry if this has caused you any inconvenience. Fortunately, the problem has been fixed, and we are actively working towards elevating your experience. We appreciate your patience. Use the updated login information that is attached to this email.
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
            <p>Kindly be advised that these login credentials are private and must not be disclosed to third parties. They are solely for your personal use during the beta testing phase.</p>
            <p>
              Warmest regards,
            <p>
              The Perbytes Team
              </p>
            </p>
          </div>
    </div>
</body>
</html>
      
        `;

        const amharic_mail = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            በቴክኒክ ችግሮች ምክንያት፣ የምርታችን ሙከራ መዘግየቱ  እንደ ነበረበት የሚታወቅ ነው።ይህ ምንም አይነት ችግር ካደረሰብዎ ይቅርታ እንጠይቃለን። እንደ እድል ሆኖ፣ ችግሩ ተስተካክሏል፣ እኛም የእርስዎን ተሞክሮ ለማሻሻል በንቃት እየሰራን ነው።  
            </p>
            <p>
             ለመጀመር፣ እባክዎ ከታች የቀረበውን አዲሱን ኢሜል እና የይለፍ ቃል ይጠቀሙ
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
            ፐርባይትስ
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