export default function otpHTML({ name, otp }: { name: string; otp: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            padding: 10px;
            background: #f8f8f8;
            display: inline-block;
            border-radius: 5px;
        }
        .expire {
            font-size: 14px;
            color: #888;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>OTP Verification</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div class="otp">${otp}</div>
        <p class="expire">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
    `;
}
