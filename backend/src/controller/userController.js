import { asyncHandler } from "../utils/asyn-handler.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("Unable to generate tokens for invalid user");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, address } = req.body

    if (
        [email, username, password, address].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        return res.status(400).json({
            success: false,
            message: "User with email or username already exists",
        });
    }

    const user = await User.create({
        address,
        status: "active",
        email,
        password,
        username: username
    })

    const createdUser = await User.findById(user._id);
    if (createdUser) {
        createdUser.select("-password -refreshToken");
    }

    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user",
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    res.status(201).json({
        success: true,
        message: 'User registered Successfully',
        data: createdUser,
    });

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // console.log(email);

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'email is required',
        });
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User does not exist",
        });
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid user credentials",
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    if (loggedInUser) {
        loggedInUser.select("-password -refreshToken");
        await loggedInUser.save({ validateBeforeSave: false });
    }

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            success: true,
            message: "User logged In Successfully",
            data: loggedInUser,
            accessToken,
            refreshToken,
        });
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json({
            success: true,
            message: "User logout Successfully",
        });
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request",
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or used",
            });

        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json({
                success: true,
                message: "Access token refreshed",
                data: accessToken,
                refreshToken: newRefreshToken,
            });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Refresh token",
        });
    }

})

const keeploginUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(202).json({ success: true, user: "nouser" });
    }

    return res.status(200).json({ success: true, user: req.user });
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, keeploginUser }