const generateAppointmentDetailsUtils = async (appointment) => {
    const details = {
        id: appointment[0].id,
        name: appointment[0].name,
        email: appointment[0].email,
        phone: appointment[0].phone,
        day: appointment[0].day,
        hour: appointment[0].hour,
        specialty: appointment[0].specialty
    };

    return details;
}

module.exports = {
    generateAppointmentDetailsUtils
}
