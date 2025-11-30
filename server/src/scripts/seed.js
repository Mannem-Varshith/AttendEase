const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { subDays, format } = require('date-fns');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    await User.deleteMany();
    await Attendance.deleteMany();

    console.log('Data Destroyed...');

    // Create Manager
    const manager = await User.create({
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Management',
    });

    // Create 30 Employees with realistic names
    const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];
    const employeeNames = [
        { first: 'Rahul', last: 'Sharma' },
        { first: 'Priya', last: 'Patel' },
        { first: 'Amit', last: 'Kumar' },
        { first: 'Sneha', last: 'Singh' },
        { first: 'Vikas', last: 'Reddy' },
        { first: 'Pooja', last: 'Gupta' },
        { first: 'Rohan', last: 'Verma' },
        { first: 'Anjali', last: 'Joshi' },
        { first: 'Sanjay', last: 'Nair' },
        { first: 'Neha', last: 'Rao' },
        { first: 'Karan', last: 'Mehta' },
        { first: 'Divya', last: 'Shah' },
        { first: 'Arjun', last: 'Desai' },
        { first: 'Kavya', last: 'Kulkarni' },
        { first: 'Vikram', last: 'Iyer' },
        { first: 'Riya', last: 'Menon' },
        { first: 'Aditya', last: 'Chopra' },
        { first: 'Meera', last: 'Agarwal' },
        { first: 'Rajesh', last: 'Bansal' },
        { first: 'Shalini', last: 'Malhotra' },
        { first: 'Manish', last: 'Kapoor' },
        { first: 'Shreya', last: 'Srinivas' },
        { first: 'Nikhil', last: 'Varma' },
        { first: 'Tanvi', last: 'Jain' },
        { first: 'Akash', last: 'Bhatia' },
        { first: 'Nisha', last: 'Saxena' },
        { first: 'Suresh', last: 'Pillai' },
        { first: 'Deepa', last: 'Yadav' },
        { first: 'Vishal', last: 'Pandey' },
        { first: 'Lakshmi', last: 'Krishnan' }
    ];

    const employees = [];

    for (let i = 1; i <= 30; i++) {
        const { first, last } = employeeNames[i - 1];
        const emp = await User.create({
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@company.com`,
            password: 'password123',
            role: 'employee',
            employeeId: `EMP${i.toString().padStart(3, '0')}`,
            department: departments[Math.floor(Math.random() * departments.length)],
        });
        employees.push(emp);
    }

    console.log('Users Created... (1 Manager + 30 Employees)');

    // Create Attendance for last 30 days
    const today = new Date();

    for (const emp of employees) {
        for (let i = 0; i < 30; i++) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            // Skip weekends (0 is Sunday, 6 is Saturday)
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            // Random status with varied patterns
            const rand = Math.random();
            let status = 'present';
            let checkIn = new Date(date);
            checkIn.setHours(9, 0, 0, 0);
            let checkOut = new Date(date);
            checkOut.setHours(17, 0, 0, 0);
            let totalHours = 8;

            if (rand < 0.1) {
                // 10% chance of being on leave
                status = 'leave';
                checkIn = null;
                checkOut = null;
                totalHours = 0;
            } else if (rand < 0.2) {
                // 10% chance of being late
                status = 'late';
                checkIn.setHours(10, 30, 0, 0);
            } else if (rand < 0.3) {
                // 10% chance of half-day
                status = 'half-day';
                checkOut.setHours(13, 0, 0, 0);
                totalHours = 4;
            }

            // Create attendance record for all statuses including absent
            await Attendance.create({
                userId: emp._id,
                date: dateStr,
                checkInTime: checkIn,
                checkOutTime: checkOut,
                status,
                totalHours,
            });
        }
    }

    console.log('Attendance Data Imported!');
    console.log(`\nCreated:`);
    console.log(`- 1 Manager (manager@example.com / password123)`);
    console.log(`- 30 Employees (firstname.lastname@company.com / password123)`);
    console.log(`- Attendance records for last 30 days (excluding weekends)`);
    console.log(`- Includes: Present (70%), Late (10%), Half-day (10%), Leave (10%)`);

    process.exit();
};

seedData();
