import jwt from "jsonwebtoken";

const generateJWT = (uid: string, name: string, imageUrl: string) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name, imageUrl };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED as string,
      {
        expiresIn: "2h",
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Falló la generación de token");
        }
        resolve(token);
      }
    );
  });
};

export default generateJWT;
