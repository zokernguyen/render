import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
    const req = axios.get(baseUrl);
    return req.then(res => res.data);
};

const addNew = (person) => {
    const req = axios.post(baseUrl, person);
    return req.then(res => res.data);
};

const update = (id, updatedPerson) => {
    const req = axios.put(`${baseUrl}/${id}`, updatedPerson);
    return req.then(res => res.data);
};

const remove = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`);
    return req.then(res => res.data);
}

export default { getAll, addNew, update, remove };