import nodemailer from 'nodemailer'

const emailRegister = async(data)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email,name, token}= data

      await transport.sendMail({
        from: 'BienesRices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRices.com',
        text: 'Confirma tu cuenta en BienesRices.com',
        html: `
            <p>Hola ${name}, comprueba tu cuenta de bienesraices.com</p>

            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a>
        
            <p>Si no creaste la cuenta puedes ignorar el mensaje</p>
        `

      })
}


const emailForgotPassword = async(data)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {email,name, token}= data

    await transport.sendMail({
      from: 'BienesRices.com',
      to: email,
      subject: 'Restablece tu password en BienesRices.com',
      text: 'Restablece tu password en BienesRices.com',
      html: `
          <p>Hola ${name}, has solicitado restablecer tu password de bienesraices.com</p>

          <p>Sigue el siguiente enlace para generar un password nuevo:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Restablecer password</a>
      
          <p>Si no solicitaste el cambio de password puedes ignorar el mensaje</p>
      `
    })
  }

export {
    emailRegister,
    emailForgotPassword
}





