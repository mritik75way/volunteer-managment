import { Request, Response } from "express";
import * as authService from "./auth.service";
import catchAsync from "../../common/utils/catchAsync";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt";
import { RegisterInput, LoginInput } from "./auth.schema";
import { Types } from "mongoose";
import AppError from "../../common/utils/AppError";
import { User } from "./user.model";

const sendTokenResponse = (
  res: Response,
  userId: Types.ObjectId,
  user: any,
  statusCode: number,
  messageText: string,
) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    status: "success",
    message: messageText,
    accessToken,
    data: { user },
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const registrationData = {
    ...req.body,
    role: "volunteer",
  };

  const newUser = await authService.createUser(registrationData);

  const userResponse = newUser.toObject();
  delete (userResponse as any).password;

  sendTokenResponse(
    res,
    newUser._id as Types.ObjectId,
    userResponse,
    201,
    "Registration successful!",
  );
});

export const login = catchAsync(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const user = await authService.loginUser(req.body);
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    sendTokenResponse(
      res,
      user._id as Types.ObjectId,
      userResponse,
      200,
      "Login successful!",
    );
  },
);

export const logout = (req: Request, res: Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError("Could not refresh access token", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await authService.findUserById(decoded.id);

  if (!user) {
    throw new AppError("User belonging to this token no longer exists", 401);
  }

  const accessToken = signAccessToken(user._id as Types.ObjectId);

  const userResponse = user.toObject();
  delete (userResponse as any).password;

  res.status(200).json({
    status: "success",
    accessToken,
    data: { user: userResponse },
  });
});

export const getAllVolunteers = catchAsync(
  async (req: Request, res: Response) => {
    const volunteers = await User.find({ role: "volunteer" }).select(
      "name email createdAt backgroundCheckStatus",
    );

    res.status(200).json({
      status: "success",
      data: { volunteers },
    });
  },
);

export const exportVolunteers = catchAsync(
  async (req: Request, res: Response) => {
    const data = await authService.getVolunteersForExport();

    if (data.length === 0) {
      return res.status(200).send("No data available");
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=volunteers_report.csv",
    );
    res.status(200).send(csv);
  },
);

export const updateMyProfile = catchAsync(
  async (req: Request, res: Response) => {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  },
);

export const updateBackgroundStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { volunteerId } = req.params;
    const { status } = req.body;

    const updatedVolunteer = await authService.updateVolunteerStatus(
      volunteerId as string,
      status,
    );

    res.status(200).json({
      status: "success",
      data: { volunteer: updatedVolunteer },
    });
  },
);
