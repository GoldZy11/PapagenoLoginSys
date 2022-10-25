import User from "../models/User";
import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const schemaRegister = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    rut: Joi.string().min(8).max(9).required(),
    cargo: Joi.string().min(3).max(255).required(),
    especialidad: Joi.string().min(3).max(255).required(),
});
const schemaEdit = Joi.object({
    name: Joi.string().min(3).max(255),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024),
    confPassword: Joi.string().min(6).max(1024),
    rut: Joi.string().min(8).max(9).required(),
    cargo: Joi.string().min(3).max(255),
    especialidad: Joi.string().min(3).max(255),
});
const schemaDelete = Joi.object({
    rut: Joi.string().min(8).max(9).required(),
});

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
});

export const registerUser = async (req, res) => {
    // validate user

    const { error } = schemaRegister.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const isEmailExist = await User.find({ email: req.body.email });
    if (isEmailExist > 1) {
        return res.status(400).json({ error: "Email ya registrado" });
    }
    const isRutExist = await User.find({ rut: req.body.rut });
    if (isRutExist > 1) {
        return res.status(400).json({ error: "Rut ya registrado" });
    }

    // hash contraseña

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        rut: req.body.rut,
        cargo: req.body.cargo,
        especialidad: req.body.especialidad,
    });
    try {
        const savedUser = await user.save();

        res.json({
            error: null,
            data: savedUser,
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({ error });
    }
};
export const loginUser = async (req, res) => {
    console.log("hola");
    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword)
        return res.status(400).json({ error: "contraseña no válida" });

    // create token
    const token = jwt.sign(
        {
            name: user.name,
            id: user._id,
        },
        process.env.TOKEN_SECRET
    );
    res.json({
        error: null,
        data: "exito bienvenido",
        token: token,
    });
};
export const editUser = async (req, res) => {
    // validate user
    console.log(req.body);
    const { error } = schemaEdit.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const isRutExist = await User.findOne({ rut: req.body.rut });
    console.log(isRutExist);
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist != null) {
        if (isEmailExist.rut != isRutExist.rut) {
            return res.status(400).json({ error: "Email en uso" });
        }
    }
    // hash contraseña
    let password;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        let reponse = await User.findOneAndUpdate(
            { rut: req.body.rut },
            req.body
        );
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
};
export const deleteUser = async (req, res) => {
    // validate user
    let rut = req.params.rut;
    console.log(req.params.rut);

    const isRutExist = await User.findOne({ rut: rut });
    if (isRutExist === null)
        return res.status(400).json({ error: "Rut inexistente" });
    // hash contraseña
    try {
        let reponse = await isRutExist.delete();
        res.json(reponse);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const getAllUser = async (req, res) => {
    // validate user
    try {
        res.json(await User.find());
    } catch (error) {
        res.status(400).json({ error });
    }
};
export const getUserByRut = async (req, res) => {
    // validate user
    let rut = req.params.rut;
    // console.log("hola");
    try {
        res.json(await User.findOne({ rut: rut }));
    } catch (error) {
        res.status(400).json({ error });
    }
};
