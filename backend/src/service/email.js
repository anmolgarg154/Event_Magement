export const sendEmail = async (mailData, res, message) => {
    try {
        console.log("Email service placeholder:", message, mailData);
        if (res) {
            res.status(200).json({
                success: true,
                message,
            });
        }
    } catch (error) {
        console.error("Email send failed", error);
        if (res) {
            res.status(500).json({ success: false, message: "Email send failed" });
        }
    }
};
