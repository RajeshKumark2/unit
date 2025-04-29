document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputValue = document.getElementById('input-value');
    const inputUnit = document.getElementById('input-unit');
    const outputValue = document.getElementById('output-value');
    const outputUnit = document.getElementById('output-unit');
    const swapBtn = document.getElementById('swap-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Conversion data
    const conversionData = {
        length: {
            units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
            conversions: {
                'Meter': 1,
                'Kilometer': 1000,
                'Centimeter': 0.01,
                'Millimeter': 0.001,
                'Mile': 1609.34,
                'Yard': 0.9144,
                'Foot': 0.3048,
                'Inch': 0.0254
            }
        },
        weight: {
            units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Ton'],
            conversions: {
                'Kilogram': 1,
                'Gram': 0.001,
                'Milligram': 0.000001,
                'Pound': 0.453592,
                'Ounce': 0.0283495,
                'Ton': 1000
            }
        },
        temperature: {
            units: ['Celsius', 'Fahrenheit', 'Kelvin'],
            conversions: {} // Handled separately due to different formula
        },
        volume: {
            units: ['Liter', 'Milliliter', 'Gallon', 'Quart', 'Pint', 'Cup', 'Fluid Ounce'],
            conversions: {
                'Liter': 1,
                'Milliliter': 0.001,
                'Gallon': 3.78541,
                'Quart': 0.946353,
                'Pint': 0.473176,
                'Cup': 0.24,
                'Fluid Ounce': 0.0295735
            }
        }
    };
    
    let currentCategory = 'length';
    
    // Initialize the converter
    function initConverter() {
        populateUnits();
        inputValue.addEventListener('input', convert);
        inputUnit.addEventListener('change', convert);
        outputUnit.addEventListener('change', convert);
        swapBtn.addEventListener('click', swapUnits);
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                currentCategory = this.dataset.category;
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                populateUnits();
                convert();
            });
        });
    }
    
    // Populate unit dropdowns
    function populateUnits() {
        const units = conversionData[currentCategory].units;
        
        // Clear existing options
        inputUnit.innerHTML = '';
        outputUnit.innerHTML = '';
        
        // Add new options
        units.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unit;
            inputUnit.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unit;
            outputUnit.appendChild(option2);
        });
        
        // Set default output unit different from input
        if (units.length > 1) {
            outputUnit.selectedIndex = 1;
        }
    }
    
    // Perform the conversion
    function convert() {
        const value = parseFloat(inputValue.value) || 0;
        const fromUnit = inputUnit.value;
        const toUnit = outputUnit.value;
        
        if (currentCategory === 'temperature') {
            outputValue.value = convertTemperature(value, fromUnit, toUnit);
        } else {
            const conversions = conversionData[currentCategory].conversions;
            const inBase = value * conversions[fromUnit];
            const converted = inBase / conversions[toUnit];
            outputValue.value = converted.toFixed(6).replace(/\.?0+$/, '');
        }
    }
    
    // Special handling for temperature conversions
    function convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        
        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'Celsius':
                celsius = value;
                break;
            case 'Fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'Kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch (toUnit) {
            case 'Celsius':
                return celsius;
            case 'Fahrenheit':
                return (celsius * 9/5) + 32;
            case 'Kelvin':
                return celsius + 273.15;
        }
    }
    
    // Swap input and output units
    function swapUnits() {
        const tempUnit = inputUnit.value;
        inputUnit.value = outputUnit.value;
        outputUnit.value = tempUnit;
        convert();
    }
    
    // Initialize the app
    initConverter();
});