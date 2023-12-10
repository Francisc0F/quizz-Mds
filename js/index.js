import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    where,
    orderBy,
    query,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNJIe-d57M3lRXMyIYW0zYzQW20CTgQ4s",
    authDomain: "quizz-2023-mds-6.firebaseapp.com",
    databaseURL: "https://quizz-2023-mds-6-default-rtdb.firebaseio.com",
    projectId: "quizz-2023-mds-6",
    storageBucket: "quizz-2023-mds-6.appspot.com",
    messagingSenderId: "63823186424",
    appId: "1:63823186424:web:4dc3d85faaba84d10aae0d",
    measurementId: "G-ZKMHMGE5QJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the Firestore database
const db = getFirestore();

// Access the 'questions' collection
export const questionsCollection = collection(db, 'questions');

export const challengesCollection = collection(db, 'challenges');
export const answersCollection = collection(db, 'answers');

export function getUser(){
    return localStorage.getItem("user");
}

export const getChallenges = (size) => {
    return new Promise((resolve, reject) => {
        const orderedChallenges = query(challengesCollection, limit(size), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(orderedChallenges, (querySnapshot) => {
            const challengesList = [];
            querySnapshot.forEach((doc) => {
                challengesList.push({ id: doc.id, ...doc.data() });
            });
            resolve(challengesList);
        }, (error) => {
            reject(error);
        });

        // If you want to unsubscribe from the snapshot listener, you can use the returned function
        // e.g., unsubscribe();
    });
}


export const updateChallenge = (challengeId, updatedData) => {

    return new Promise((resolve, reject) => {
        const challengeRef = doc(challengesCollection, challengeId);
        // Use update method to update the challenge with the new data
        updateDoc(challengeRef, updatedData)
            .then(() => {
                resolve("Challenge updated successfully");
            })
            .catch((error) => {
                reject(error);
            });
    });
};


export const deleteChallenge = (challengeId) => {
    return new Promise((resolve, reject) => {
        const challengeRef = doc(challengesCollection, challengeId);

        // Use deleteDoc method to delete the challenge
        deleteDoc(challengeRef)
            .then(() => {
                resolve("Challenge deleted successfully");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const fetchChallenges = () => {
    const orderedChallenges = query(challengesCollection, limit(1), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(orderedChallenges, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            renderChallengeButton(doc.data().title, doc.id);
        });
    }, (error) => {
        console.error('Error getting documents: ', error);
    });
};


const renderChallengeButton = (title, id) => {
    const buttonElement = document.createElement('button');
    buttonElement.className = 'btn';
    buttonElement.innerText = title;

    // Add onClick event to start the challenge
    buttonElement.addEventListener('click', () => {
        var userInput = newUserInputBox.value;
        localStorage.setItem("user", userInput);

        getQuestions(id).then(() => {
            quizzLink();
        });
    });

    // Append the button to the "awaiting-text" element
    document.getElementById('awaiting-text').innerHTML = '';
    document.getElementById('awaiting-text').appendChild(buttonElement);
};


// Now you can perform operations on the questions collection, such as getting documents
const getQuestions = async (challengeId) => {
    const querySnapshot = await getDocs(
        query(questionsCollection, where('new_challenge_key', '==', challengeId))
    );

    // Initialize an array to store the questions
    const questions = [];

    // Iterate through the documents in the querySnapshot
    querySnapshot.forEach((doc) => {
        // Get the data from each document
        const questionData = doc.data();

        // Push the data into the questions array
        if (questionData.new_challenge_key) {
            questions.push(questionData);
        }
    });
    // Save data
    localStorage.setItem('questions', JSON.stringify(questions));
    console.log(questions);
};


let newUserInputBox = document.getElementById("nickname");

let admin = false;

function start() {
    var userInput = newUserInputBox.value;

    if (!userInput) {
        alert("Nickname is required.");
    } else {
        // Check if the user is an admin
        if (isAdmin(userInput)) {
            // If user is an admin, navigate to admin.html
            admin = true;
            window.location.href = './html/admin.html';
        } else {
            // If not admin, store user in localStorage and navigate to quizzLink
            localStorage.setItem("user", userInput);
            quizzLink();
        }
    }
}

// Function to check if the user is an admin
function isAdmin(username) {
    // Replace this with your logic to determine admin status
    // For example, you might have an array of admin usernames
    var adminUsernames = ["admin", "admin1", "admin2"];
    return adminUsernames.includes(username);
}


function onClickEnter() {
    var userInput = newUserInputBox.value;

    if (!userInput) {
        alert("Nickname is required.");
        return;
    }

    if (isAdmin(userInput)) {
        // If user is an admin, navigate to admin.html
        admin = true;
        window.location.href = './html/admin.html';
    }

    document.getElementById('challenge-container').classList.add('display-none');
    document.getElementById('awaiting-text').classList.add('display-block');

    const intervalId = setInterval(fetchChallenges, 3000);
}

function scoreboardlink() {
    window.location.href = "./html/scorboard.html";
}

function quizzLink() {
    window.location.href = "./html/quiz.html";
}


window.onClickEnter = onClickEnter;
window.scoreboardlink = scoreboardlink;