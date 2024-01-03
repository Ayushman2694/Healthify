import React, { useState } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";



const Homepage = () => {
  const navigate = useNavigate();
  
  const [totalCalories, setTotalCalories] = useState(0);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [bmiResult, setBmiResult] = useState('');
  const [mealList, setMealList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedMealIndex, setSelectedMealIndex] = useState(null);
  const [selectedMealCalories, setSelectedMealCalories] = useState(null);

  const addMeal = () => {
    if (mealName && calories) {
      const newMeal = { name: mealName, calories: parseInt(calories, 10) };

      // If updating a meal, replace the old meal with the updated one
      const updatedMealList = mealList.map((meal, index) =>
        index === selectedMealIndex ? newMeal : meal
      );

      setMealList(updatedMealList);

      // Update total calories
      setTotalCalories(prevTotalCalories => {
        const removedCalories = selectedMealCalories || 0;
        return prevTotalCalories - removedCalories + newMeal.calories;
      });

      // Clear the form
      setMealName('');
      setCalories('');
      setSelectedMealIndex(null);
      setSelectedMealCalories(null);
    } else {
      alert('Please enter both meal name and calories.');
    }
  };

  const updateTotalCalories = () => {
    return <p>Total Calories: {totalCalories}</p>;
  };

  const calculateBMI = () => {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (weight && height) {
      const bmi = weight / ((height / 100) ** 2);
      const roundedBMI = parseFloat(bmi.toFixed(2));
      setBmiResult(`Your BMI: ${roundedBMI} (${getBMICategory(roundedBMI)})`);
    } else {
      alert('Please enter both weight and height.');
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Normal Weight';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Overweight';
    } else {
      return 'Obese';
    }
  };

  // Handle toggling the meal form visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setMealName('');
    setCalories('');
  };

  // Handle updating a meal
  const updateMeal = (index) => {
    const selectedMeal = mealList[index];

    setMealName(selectedMeal.name);
    setCalories(selectedMeal.calories.toString());
    setSelectedMealIndex(index);
    setSelectedMealCalories(selectedMeal.calories);
    toggleForm();
  };

  return (
    <div class="div1">
      <header>
        <h1>Calorie Tracker &amp; BMI Calculator</h1>
        <button id="logout" onClick={() => navigate("/register")}>Logout</button>
      </header>
      <button id="toggleForm" onClick={toggleForm}>
        {isFormVisible ? 'Cancel Update' : 'Update Meal'}
      </button>
      <form id="mealForm" style={{ display: isFormVisible ? 'block' : 'none' }}>
        <label htmlFor="mealName">Meal Name:</label>
        <input type="text" id="mealName" value={mealName} onChange={(e) => setMealName(e.target.value)} required />
        <label htmlFor="calories">Calories:</label>
        <input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} required />
        <button type="button" onClick={addMeal}>
          {selectedMealIndex !== null ? 'Update Meal' : 'Add Meal'}
        </button>
      </form>
      <ul>
        {mealList.map((meal, index) => (
          <li key={index}>
            {meal.name} - {meal.calories} calories
            <button onClick={() => updateMeal(index)}>Edit</button>
          </li>
        ))}
      </ul>
      {updateTotalCalories()}
      <hr />
      <div id="bmiCalculator">
        <h2>BMI Calculator</h2>
        <label htmlFor="weight">Weight (kg):</label>
        <input type="number" id="weight" required />
        <label htmlFor="height">Height (cm):</label>
        <input type="number" id="height" required />
        <button type="button" onClick={calculateBMI}>Calculate BMI</button>
        <div>{bmiResult}</div>
      </div>
      {/* History of Meals Section */}
      <div id="mealHistory">
        <h2>Meal History</h2>
        <ul>
          {mealList.map((meal, index) => (
            <li key={index}>
              {meal.name} - {meal.calories} calories
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;
