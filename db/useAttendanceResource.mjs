import useUsersResource from "./useUsersResource.mjs"
let useUsers = useUsersResource()
function useAttendanceResource() {
    const arrivalTime = {
        hour: 4,
        minutes: 30
    };
    const departureTime = {
        hour: 4,
        minutes: 40
    };
    const resourceName = "attendance";

    function createArriveDateObj(dateString) {
        let now = new Date(dateString)
        now.setHours(arrivalTime.hour, arrivalTime.minutes, 0)
        return now;
    }
    function createLeaveDateObj(dateString) {
        let now = new Date(dateString)
        now.setHours(departureTime.hour, departureTime.minutes, 0)
        return now;
    }


    function getAllAttendance() {
        return JSON.parse(localStorage.getItem(resourceName)) || {}
    }

    function _setAllAttendance(attendance) {
        return localStorage.setItem(resourceName, JSON.stringify(attendance))
    }

    function getAttendanceOfEmployeeInDay(empUsername, dateObj) {
        let user = useUsers._getUserByUserName(empUsername);
        if (user === -1) {
            let err = new Error("User Not Found")
            err.fieldsNames = ["username"]
            throw err
        }
        let attendance = getAllAttendance()
        let attendanceOfDate = attendance[dateObj.toLocaleDateString()];

        if (!attendanceOfDate || !attendanceOfDate[user.username]) {
            return -1;
        }

        let data = { ...user, ...attendance[dateObj.toLocaleDateString()][user.username] };
        delete data.password;
        return data
    }

    function getAttendanceOfEmployeeInRange(empUsername, fromDateObj, toDateObj) {
        let user = useUsers._getUserByUserName(empUsername);
        if (user === -1) {
            let err = new Error("User Not Found")
            err.fieldsNames = ["username"]
            throw err
        }
        delete user.password;

        let attendance = getAllAttendance()
        let minDateObj = new Date(Math.min(fromDateObj, toDateObj))
        let maxDateObj = new Date(Math.max(fromDateObj, toDateObj))
        let data = []
        for (let i = minDateObj; i <= maxDateObj; i.setDate(i.getDate() + 1)) {
            let dayAttendance = attendance[i.toLocaleDateString()]
            if (!dayAttendance || !dayAttendance[user.username]) {
                data.push({
                    date: i.toString(),
                    state: "absence",
                    inTime: "-",
                    outTime: "-",
                    isGone: false
                })
            }
            else
                data.push({
                    date: i.toString(),
                    state: "presence",
                    inTime: dayAttendance[user.username].inTime,
                    outTime: dayAttendance[user.username].outTime,
                    isGone: dayAttendance[user.username].isGone
                })
        }
        return { ...user, attendance: data }
    }

    function getFullReportOfSelectedDay(dataObj) {
        const users = useUsers.getAllUsers();
        const attendance = getAllAttendance()[dataObj.toLocaleDateString()];
        if (!attendance) {
            return -1;
        }
        let data = []
        for (const key in users) {
            if (Object.hasOwnProperty.call(attendance, key)) {
                data.push({
                    fullName: `${users[key].firstName} ${users[key].lastName}`,
                    state: "presence",
                    inTime: attendance[key].inTime,
                    outTime: attendance[key].outTime,
                    isGone: attendance[key].isGone
                })
            } else {
                data.push({
                    fullName: `${users[key].firstName} ${users[key].lastName}`,
                    inTime: "-",
                    outTime: "-",
                    state: "absence",
                    isGone: false

                })
            }
        }
        return data
    }

    function addAttendance(username) {
        let user = useUsers._getUserByUserName(username);
        if (user === -1) {
            let err = new Error("User Not Found")
            err.fieldsNames = ["username"]
            throw err
        }
        let attendance = getAllAttendance()
        let now = new Date()
        let officialArrival = createArriveDateObj(now);
        let officialDeparture = createLeaveDateObj(now);



        if (!Object.hasOwnProperty.call(attendance, now.toLocaleDateString())) {
            attendance[now.toLocaleDateString()] = {}
        }

        if (Object.hasOwnProperty.call(attendance[now.toLocaleDateString()], username)) {
            attendance[now.toLocaleDateString()] = {
                ...attendance[now.toLocaleDateString()],
                [user.username]: { ...attendance[now.toLocaleDateString()][user.username], outTime: now.toString(), isGone: true }
            }
        } else {

            if (!((now >= officialArrival) && (now < officialDeparture))) {
                let err = new Error(`Employee Can't Arrive Out of the Working hours ${officialArrival.toLocaleTimeString()} till ${officialDeparture.toLocaleTimeString()} `)
                throw err
            }
            attendance[now.toLocaleDateString()] = {
                ...attendance[now.toLocaleDateString()],
                [user.username]: { inTime: now.toString(), outTime: officialDeparture.toString(), isGone: false }
            }
        }

        _setAllAttendance(attendance);

        return getAttendanceOfEmployeeInDay(username, now)
    }

    return { addAttendance, getAllAttendance, createArriveDateObj, createLeaveDateObj, getFullReportOfSelectedDay, getAttendanceOfEmployeeInDay, getAttendanceOfEmployeeInRange }
}
export default useAttendanceResource;