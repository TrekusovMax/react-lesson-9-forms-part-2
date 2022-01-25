import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";

const UserEditPage = ({ userId }) => {
    const [user, setUser] = useState();
    const [errors, setErrors] = useState({});
    const [professions, setProfessions] = useState();
    const [qualities, setQualities] = useState();
    const history = useHistory();
    const qualitieNames = [];

    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
        api.professions.fetchAll().then((data) => setProfessions(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);

    const validatorConfig = {
        name: {
            isRequired: {
                message: "Имя обязателено для заполнения"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        }
    };

    if (user) {
        Object.values(user.qualities).map((qualitie) =>
            qualitieNames.push({
                _id: qualitie._id,
                label: qualitie.name,
                name: qualitie.name
            })
        );
    }
    useEffect(() => {
        validate();
    }, [user]);
    const validate = () => {
        const errors = validator(user, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        api.users.update(userId, user);
        history.push(`/users/${userId}`);
    };

    const handleChange = (target) => {
        if (target.name === "profession") {
            const professionName = Object.values(professions).find(
                (profession) => Object.values(profession).includes(target.value)
            ).name;

            setUser((prevState) => ({
                ...prevState,
                [target.name]: { _id: target.value, name: professionName }
            }));
        } else if (target.name === "qualities") {
            const { value } = target;

            const qualitieValue = Object.values(value).map(
                (qualitie) => qualitie.value
            );
            const qualitieObject = Object.values(qualities).filter((qualitie) =>
                qualitieValue.includes(qualitie._id)
            );

            setUser((prevState) => ({
                ...prevState,
                [target.name]: [...user.qualities, ...qualitieObject]
            }));
        } else if (target) {
            setUser((prevState) => ({
                ...prevState,
                [target.name]: target.value
            }));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {user && (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professions}
                                name="profession"
                                onChange={handleChange}
                                value={user.profession._id}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" }
                                ]}
                                value={user.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />

                            <MultiSelectField
                                name="qualities"
                                label="Выберите ваши качества"
                                options={qualities}
                                onChange={handleChange}
                                defaultValue={qualitieNames}
                            />
                            <button
                                className="btn btn-primary mx-auto"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isValid}
                            >
                                Сохранить изменения
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

UserEditPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserEditPage;
