import Razorpay from 'razorpay';
import crypto from 'crypto';
import users from '../models/auth.js';
import dotenv from 'dotenv';

dotenv.config();

var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET });

export const order = async (req, res) => {
    var options = {
        amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
    };

    try {
        const order = await instance.orders.create(options);
        res.json({
            success: true,
            order,
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong " });
    }

}

export const verifyOrder = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.response;
    const _id = req.body.id;
    const amount = req.body.amount;

    // Verify the payment signature
    try {
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            if (amount === 100) {
                const user = await users.findByIdAndUpdate(_id, {
                    subscription: 'silver',
                    subsExpire: new Date().getTime() + 30 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({
                    success: true,
                    result: user
                })
            } else if (amount === 1000) {
                const user = await users.findByIdAndUpdate(_id, {
                    subscription: 'gold',
                    subsExpire: new Date().getTime() + 30 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({
                    success: true,
                    result: user
                })
            } else {
                res.status(400).json({"success": false})
            }
        } else {
            res.status(400).json({
                success: false,
            });
        }
    } catch (err) {
        res.status(500).json({  error: "Something went wrong " });
    }
}

export const checkSubscription = async (req, res) => {
    const {id: _id}=req.params;
    try {
        const user = await users.findById(_id);

        if (user.subscription === 'free') {
            if (user.numberOfQuestions >= 1) {
                return res.status(200).json({
                    success: false,
                    message: "You have exceeded the number of questions you can ask for the day. Upgrade your plan to ask more questions."
                })
            }
            return res.status(200).json({ success: true })
        }
        else if (user.subscription === 'silver') {
            if (user.subsExpire > new Date().getTime()) {
                if (user.numberOfQuestions >= 5) {
                    return res.status(200).json({
                        success: false,
                        message: "You have exceeded the number of questions you can ask for the day. Upgrade your plan to ask more questions."
                    })
                }
                return res.status(200).json({
                    success: true,
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: "Your subscription has expired. Click to renew your subscription."
                })
            }
        } else if (user.subscription === 'gold') {
            if (user.subsExpire > new Date().getTime()) {
                res.status(200).json({
                    success: true,
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: "Your subscription has expired. Click to renew your subscription."
                })
            }
        } else {
            res.status(200).json({
                success: false,
            })
        }
    } catch (err) {
        res.status(500).json({ error: "Something went wrong " });
    }
}

const refreshQuestions = async (req, res) => {
    console.log("Questions refreshed")
    await users.updateMany({}, {$set: { numberOfQuestions: 0 }});

}

// refreshQuestions();

setInterval(refreshQuestions, 24*60*60 * 1000);