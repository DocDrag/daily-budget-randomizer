function randomizeBudget() {
    const totalMoney = parseFloat(document.getElementById('totalMoney').value);
    const days = parseInt(document.getElementById('days').value);

    // Reset errors
    document.getElementById('moneyError').classList.remove('show');
    document.getElementById('daysError').classList.remove('show');

    // Validate inputs
    let hasError = false;

    if (isNaN(totalMoney) || totalMoney < 100) {
        document.getElementById('moneyError').classList.add('show');
        hasError = true;
    }

    if (isNaN(days) || days < 1) {
        document.getElementById('daysError').classList.add('show');
        hasError = true;
    }

    // Check if minimum budget per day can be met
    const minPerDay = 100;
    if (!hasError && totalMoney < minPerDay * days) {
        document.getElementById('moneyError').textContent = `จำนวนเงินต้องไม่น้อยกว่า ${minPerDay * days} บาท (${minPerDay} บาท/วัน × ${days} วัน)`;
        document.getElementById('moneyError').classList.add('show');
        hasError = true;
    }

    if (hasError) {
        document.getElementById('result').classList.remove('show');
        return;
    }

    // Helper function to round to nearest 5
    function roundToNearestFive(num) {
        return Math.round(num / 5) * 5;
    }

    // Random budget allocation
    const budgets = [];
    let remaining = totalMoney;

    // Allocate minimum 100 baht per day first
    for (let i = 0; i < days; i++) {
        budgets.push(minPerDay);
        remaining -= minPerDay;
    }

    // Randomly distribute the remaining money (in multiples of 5)
    while (remaining >= 5) {
        const randomDay = Math.floor(Math.random() * days);
        const maxAdd = Math.min(remaining, Math.floor(remaining / days * 2));
        const amountToAdd = roundToNearestFive(Math.floor(Math.random() * maxAdd) + 5);
        
        if (amountToAdd <= remaining) {
            budgets[randomDay] += amountToAdd;
            remaining -= amountToAdd;
        }
    }

    // Distribute any remaining small amount (less than 5) to random days
    while (remaining > 0) {
        const randomDay = Math.floor(Math.random() * days);
        budgets[randomDay] += remaining;
        remaining = 0;
    }

    // Round all budgets to nearest 5 if possible, but ensure total matches
    let total = budgets.reduce((sum, val) => sum + val, 0);
    
    if (total !== totalMoney) {
        // Adjust the difference to a random day
        const diff = totalMoney - total;
        const randomDay = Math.floor(Math.random() * days);
        budgets[randomDay] += diff;
    }

    // Shuffle to make it more random
    for (let i = budgets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [budgets[i], budgets[j]] = [budgets[j], budgets[i]];
    }

    // Display results
    const daysList = document.getElementById('daysList');
    daysList.innerHTML = '';

    let displayTotal = 0;
    budgets.forEach((amount, index) => {
        displayTotal += amount;
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';
        dayItem.innerHTML = `
            <span class="day-number">วันที่ ${index + 1}</span>
            <span class="day-amount">${amount.toLocaleString('th-TH')} ฿</span>
        `;
        daysList.appendChild(dayItem);
    });

    document.getElementById('totalDisplay').textContent = `รวมทั้งหมด: ${displayTotal.toLocaleString('th-TH')} บาท`;
    document.getElementById('result').classList.add('show');
}

// Allow Enter key to trigger randomization
document.getElementById('totalMoney').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') randomizeBudget();
});

document.getElementById('days').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') randomizeBudget();
});