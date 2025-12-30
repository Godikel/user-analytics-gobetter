export interface UserModule {
  completed: number;
  distributed: number;
}

export interface User {
  id: string;
  name: string;
  userId: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Hired" | "Terminated";
  createdOn: string;
  joiningDate: string;
  lastActive: string;
  timeSpent: string;
  avatar?: string;
  location: string;
  referenceId: string;
  organization: string;
  leaderboardRank: number;
  modules: {
    courses: UserModule;
    assessments: UserModule;
    surveys: UserModule;
    learningJourneys: UserModule;
    ilts: UserModule;
    feeds: UserModule;
  };
}

const firstNames = [
  "Aadesh", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Rohan", "Kavya", 
  "Arjun", "Meera", "Siddharth", "Nisha", "Karan", "Divya", "Amit", "Pooja",
  "Rajesh", "Swati", "Manoj", "Ritika", "Suresh", "Deepika", "Vijay", "Simran",
  "Ajay", "Neha", "Sandeep", "Tanvi", "Arun", "Shruti", "Nikhil", "Rashmi",
  "Gaurav", "Pallavi", "Ashish", "Megha", "Vivek", "Sonali", "Prakash", "Anjali",
  "Dinesh", "Komal", "Ramesh", "Bhavna", "Naveen", "Renu", "Hemant", "Shikha",
  "Mukesh", "Preeti"
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Verma", "Joshi", "Yadav",
  "Reddy", "Nair", "Menon", "Iyer", "Rao", "Das", "Mehta", "Shah",
  "Malhotra", "Chopra", "Khanna", "Kapoor", "Bhatia", "Arora", "Sinha", "Mishra",
  "Tiwari", "Pandey", "Saxena", "Agarwal", "Bansal", "Goel", "Mittal", "Jain",
  "Sethi", "Chauhan", "Bhatt", "Desai", "Patil", "Kulkarni", "Deshpande", "Pillai",
  "Krishnan", "Rajan", "Venkat", "Subramaniam", "Chatterjee", "Mukherjee", "Sen", "Dutta",
  "Roy", "Ghosh"
];

const roles = [
  "Software Engineer", "Product Manager", "Data Analyst", "Marketing Executive",
  "Sales Representative", "HR Manager", "Finance Analyst", "Operations Lead",
  "Customer Success Manager", "Technical Lead", "UX Designer", "Content Writer",
  "Business Analyst", "Project Manager", "Quality Assurance", "DevOps Engineer"
];

const locations = [
  "Gurgaon", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Pune", 
  "Kolkata", "Noida", "Ahmedabad"
];

const organizations = ["ITGI", "TechCorp", "InnovateLabs", "DataSystems", "CloudFirst"];

const statuses: User["status"][] = ["Active", "Inactive", "Hired", "Terminated"];
const genders: User["gender"][] = ["Male", "Female", "Other"];

function generatePhone(): string {
  const prefix = ["91", "92", "93", "94", "95", "96", "97", "98", "99"];
  return `+91${prefix[Math.floor(Math.random() * prefix.length)]}${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateTimeSpent(): string {
  const hours = Math.floor(Math.random() * 50);
  const mins = Math.floor(Math.random() * 60);
  const secs = Math.floor(Math.random() * 60);
  return `${hours} hrs ${mins} mins ${secs} secs`;
}

function generateDateTime(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear + 1));
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

function generateModules(): User["modules"] {
  return {
    courses: { completed: Math.floor(Math.random() * 30), distributed: Math.floor(Math.random() * 30) + 10 },
    assessments: { completed: Math.floor(Math.random() * 20), distributed: Math.floor(Math.random() * 20) + 5 },
    surveys: { completed: Math.floor(Math.random() * 10), distributed: Math.floor(Math.random() * 10) + 2 },
    learningJourneys: { completed: Math.floor(Math.random() * 8), distributed: Math.floor(Math.random() * 8) + 2 },
    ilts: { completed: Math.floor(Math.random() * 15), distributed: Math.floor(Math.random() * 15) + 3 },
    feeds: { completed: Math.floor(Math.random() * 20), distributed: Math.floor(Math.random() * 20) + 5 },
  };
}

export const users: User[] = Array.from({ length: 50 }, (_, index) => {
  const firstName = firstNames[index];
  const lastName = lastNames[index];
  const gender = index % 2 === 0 ? "Male" : (index % 3 === 0 ? "Other" : "Female");
  
  return {
    id: `USR${String(index + 1).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    userId: `${String(10000 + index)}`,
    age: 22 + Math.floor(Math.random() * 35),
    gender: gender as User["gender"],
    phone: generatePhone(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    role: roles[index % roles.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdOn: generateDateTime(2023, 2024),
    joiningDate: generateDateTime(2020, 2024),
    lastActive: generateDateTime(2024, 2025),
    timeSpent: generateTimeSpent(),
    location: locations[index % locations.length],
    referenceId: generateUUID(),
    organization: organizations[index % organizations.length],
    leaderboardRank: index + 1,
    modules: generateModules(),
  };
});

// Adjust modules to ensure completed <= distributed
users.forEach(user => {
  Object.keys(user.modules).forEach(key => {
    const module = user.modules[key as keyof User["modules"]];
    if (module.completed > module.distributed) {
      module.completed = module.distributed;
    }
  });
});

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}
