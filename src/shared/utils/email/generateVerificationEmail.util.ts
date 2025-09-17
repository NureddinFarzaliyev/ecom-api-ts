export const generateVerificationEmail = (
  fullName: string,
  verificationCode: string,
) => `
  <h2>E-Commerce Hesabınızı Təsdiqləyin</h2>
  <p>Hörmətli ${fullName},</p>
  <p>E-Commerce hesabınızı təsdiqləmək üçün aşağıdakı linkə daxil olun:</p>
  <b><a href="${process.env.CLIENT_URL}/verify?token=${verificationCode}">Hesabımı Təsdiqlə</a></b>
  <p>Əgər bu əməliyyatı siz etməmisinizsə, zəhmət olmasa bu e-poçtu nəzərə almayın.</p>
`;

export const verificationEmailSubject = "E-Commerce Hesabınızı Təsdiqləyin";
