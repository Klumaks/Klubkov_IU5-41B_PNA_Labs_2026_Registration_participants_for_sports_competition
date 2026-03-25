    window.onload = function(){
        // Переменные для хранения чисел и операций
        let a = ''           // Первое число
        let b = ''           // Второе число
        let expressionResult = ''  // Результат вычисления
        let selectedOperation = null  // Выбранная операция
            // Получаем доступ к экрану калькулятора в поле вывода
        const outputElement = document.getElementById("result")

        let varianceData = []  // Массив для хранения данных для дисперсии

        // Получаем все кнопки с цифрами (их id начинаются с "btn_digit_")
        const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

        function onDigitButtonClicked(digit) {
            // Если операция не выбрана, работаем с первым числом (a) - после выбора операции начинается ввод второго числа
            if (!selectedOperation) {
                // Проверяем, не пытаемся ли мы добавить вторую точку
                if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
                    // здесь у нас происходит складывание сохраненного уже числа и нажатой цифры. Оба поля string, поэтому
                    // каждый раз цифра записывается в конец строки. Например: a = '14', digit = '5',
                    // a += digit - это короткая запись a = a + digit - поэтомоу после этой операции a = '145'
                    a += digit;
                }
                outputElement.innerHTML = a;
            }
            // Если операция выбрана, работаем со вторым числом (b)
            else {
                if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
                    b += digit;
                    outputElement.innerHTML = b;
                }
            }
        }

        // Функция для вычисления дисперсии
function calculateVariance(data) {
    if (data.length < 2) return 0;

    // Вычисляем среднее
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }
    const mean = sum / data.length;

    // Вычисляем сумму квадратов отклонений
    let sumSquaredDiffs = 0;
    for (let i = 0; i < data.length; i++) {
        sumSquaredDiffs += Math.pow(data[i] - mean, 2);
    }

    // Дисперсия (делим на n-1)
    return sumSquaredDiffs / (data.length - 1);
}
            // Настраиваем обработчики для цифровых кнопок - для каждой кнопки с цифрой и точкой вызываем выше написанную функцию по формированию числа
        digitButtons.forEach(button => {
            button.onclick = function() {
                // берем текст, написанный на кнопке - он и является цифрой
                const digitValue = button.innerHTML;
                onDigitButtonClicked(digitValue);
            }
        });

        // Настраиваем обработчики для кнопок операций - сохраняем выбранную операцию в ранее созданную переменную selectedOperation
        document.getElementById("btn_op_mult").onclick = function() {
            if (a === '') return;
            selectedOperation = 'x';
        }
        document.getElementById("btn_op_plus").onclick = function() {
            if (a === '') return;
            selectedOperation = '+';
        }
        document.getElementById("btn_op_minus").onclick = function() {
            if (a === '') return;
            selectedOperation = '-';
        }
        document.getElementById("btn_op_div").onclick = function() {
            if (a === '') return;
            selectedOperation = '/';
        }
    // Очищаем все значения при нажатии на кнопку C (вешаем обработчик события click на кнопку С)
    document.getElementById("btn_op_clear").onclick = function() {
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
        varianceData = []
    }
// Кнопка добавления числа в массив для дисперсии
document.getElementById("btn_op_add_to_array").onclick = function() {
    if (a === '') {
        outputElement.innerHTML = "Сначала введите число!";
        return;
    }

    const numValue = parseFloat(a);
    varianceData.push(numValue);
    outputElement.innerHTML = `Добавлено: ${numValue} | Всего: ${varianceData.length}`;
    a = '';  // Очищаем для следующего ввода
}

    // Вычисляем результат при нажатии на = (вешаем обработчик события click на кнопку =)
    document.getElementById("btn_op_equal").onclick = function() {
            // Если есть данные для дисперсии, вычисляем дисперсию
    if (varianceData.length > 0) {
        if (varianceData.length < 2) {
            outputElement.innerHTML = `Нужно минимум 2 значения! Сейчас: ${varianceData.length}`;
            varianceData = [];  // Очищаем
            return;
        }

        const variance = calculateVariance(varianceData);
        const mean = varianceData.reduce((sum, val) => sum + val, 0) / varianceData.length;

        outputElement.innerHTML = `Дисперсия: ${variance.toFixed(4)} \n Среднее: ${mean.toFixed(2)}`;
        varianceData = [];  // Очищаем массив после вычисления
        return;
    }
        // Проверяем, что у нас есть оба числа и операция
        if (a === '' || b === '' || !selectedOperation)
            return

        // Выполняем выбранную операцию - чтобы не плодить if, воспользуемся удобной и более наглядной функцией сравнения switch, которая на основе значения переданной переменной выполняет нужный кейс. В case указывается ожидаемое точное значение переменной (это может быть любое значение), а затем после : пишется код, который нужно выполнить в данном случае. Case проверяются последовательно, выход из switch происходит при попадании на break или если значение не совпало ни с чем.
        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b)
                // обязательно пишется в конце действий case, чтобы выйти из switch, иначе продолжится сравнение case дальше
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;
            // желательно (но не обязательно) всегда прописывать дефолтное поведение, в случае если в переменной окажется не перечисленное выше значение. в нашем случае это не нужно.
            default:
                break;
        }

        // Сохраняем результат и очищаем второе число, чтобы при новом вводе записывать значение нового числа в b
        a = expressionResult.toString()
        b = ''
        selectedOperation = null

        // Показываем результат на экране
        outputElement.innerHTML = a
    }
};
