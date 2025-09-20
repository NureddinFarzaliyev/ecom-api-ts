export const generatePasswordResetEmail = (
  verificationCode: string,
  userId: string,
) => `
  <h2>E-Commerce Şifrənizi Yeniləyin</h2>
  <p>Hörmətli istifadəçi,</p>
  <p>Sizin hesabınızın şifrəsinin dəyişilməsi üçün müraciət qeydə alınmışdır. Əgər bu əməliyyatı özünüz yerinə yetirmisinizsə, davam etmək üçün aşağıdakı linkə klikləyin. Əgər müraciəti siz etməmisinizsə, bu e-poçtu nəzərə almayın.</p>
  <b><a href="${process.env.CLIENT_URL}/reset-password?token=${verificationCode}&id=${userId}">Şifrəni Dəyiş</a></b>
`;

export const passwordResetEmailSubject = "E-Commerce Şifrənizi Dəyişin";
