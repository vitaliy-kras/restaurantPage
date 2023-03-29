
window.addEventListener('DOMContentLoaded', () => {
      
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'); 

    function hideTabContent() {
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show','fade');
        });

        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
            tabsContent[i].classList.add('show', 'fade');
            tabsContent[i].classList.remove('hide');
            tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event)=> {    
            const target = event.target;
            if(target && target.classList.contains('tabheader__item')){
                tabs.forEach((item, i)=> {
                    if(target == item){
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
    });

//timer

    const dedline = '2023-01-20';

let days, hours, minutes, seconds;
function getTimeRemining(endtime){
    const t = Date.parse(endtime) - Date.parse(new Date());
            if(t <= 0){ 
                days = 0,
                hours = 0,
                minutes = 0,
                seconds = 0;
        }else{
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
}

        return {
        'total': t,
        'days':  days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
        };
}
//функція додавання нуля перед числом до 10
function getZero(num){
    if(num >= 0 && num < 10){
        return `0${num}`;
    } else {
        return num;
    }
}

function setClock(selector, endtime){
    const timer = document.querySelector(selector),
    days = timer.querySelector('#days'),
    hours = timer.querySelector('#hours'),
    minutes = timer.querySelector('#minutes'),
    seconds = timer.querySelector('#seconds'),
    timeInterval = setInterval(updateClock, 1000);

    updateClock();// визиваєм тут щоб не мигало

    function updateClock(){
        const t = getTimeRemining(endtime);
        days.innerHTML = getZero(t.days);
        hours.innerHTML = getZero(t.hours);
        minutes.innerHTML = getZero(t.minutes);
        seconds.innerHTML = getZero(t.seconds);

        if(t.total <= 0){
            clearInterval();
        }
    }
}
setClock('.timer', dedline);

//modal

const modalTrigger = document.querySelectorAll('[data-modal]'),
        //кнопкИ звязатись з нами, які визивають модальне вікно
      modal = document.querySelector('.modal');
      //дів із модальним віконм

function openModal(){//функція ВІДКРИТТЯ модального вікна
        modal.classList.add('show');//додаєм клас показати 
        modal.classList.remove('hide');//прпбираємо приховати
        //можна було і так     modal.classList.toggle('show');
        document.body.style.overflow ='hidden';
        //щоб основна сторінка не прокручувалась коли модальне в. відкрите
        clearInterval(modalTimerId);
        //очищаєм тамаут установлений для автоматично всплиття через певний час
    }

 modalTrigger.forEach(btn => { //ставимо прослуховувач подій на масив з кнопками
        btn.addEventListener('click', openModal); // із функцією відкриття
       });
     
function closeModal(){//функція ЗАКРИТТЯ модального вікна
    modal.classList.add('hide');//навпаки додаєм клас приховати
    modal.classList.remove('show');// і прибираєм клас показати
    document.body.style.overflow ='';//щоб прокручувалось
}
      

    modal.addEventListener('click', (e)=>{
            if(e.target === modal || e.target.getAttribute('data-close') == ''){
                closeModal();
            }// закриття модального вікна від кліку на фон або хрестик
    });

    document.addEventListener('keydown', (e) => {
            if(e.code === 'Escape' && modal.classList.contains('show')){
                closeModal();
            }// закриття модального вікна від ESC
    });

        const modalTimerId = setTimeout(openModal, 50000);
        //вспливає вікно через 50 секунд


   function showModalByScroll(){
    //чи долистав користувач до кінця сторінки прочитане + що дивиться(-баг -1)
            if(window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight-1){
                openModal();
            window.removeEventListener('scroll', showModalByScroll);
                //щоб показувало один раз
        }

   }

    window.addEventListener('scroll', showModalByScroll);






//меню 
class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector){
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH();
    }
    changeToUAH(){return this.price *=  this.transfer;
    }
    
    render() {
    const element = document.createElement('div');
    element.innerHTML = `<div class="menu__item">
    <img src= ${this.src} alt=${this.alt}>
    <h3 class="menu__item-subtitle">${this.title}</h3>
    <div class="menu__item-descr">${this.descr}</div>
    <div class="menu__item-divider"></div>
    <div class="menu__item-price">
    <div class="menu__item-cost">Цена:</div>
    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
    </div>
    </div>`;
        this.parent.append(element);
}

}

// const getResource = async (url) => {
//     const res = await fetch(url);
//     if(!res.ok){
//        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }
//     return await res.json();
// };


axios.get('http://localhost:3000/menu')//дані автоматично зконвертуються з json
.then(data =>   {data.data.forEach(({img, altimg, title, descr, price}) => {
        new MenuCard (img, altimg, title, descr, price, '.menu .container').render();
    });
});



    //FORMS
    const forms = document.querySelectorAll('form');// заносимо всі форми в перемінну

    const message = {// створюємо обєкт з повідомленнями
            loading: 'img/form/spinner.svg', //зображення спінера -завантаження
            success: 'Скоро ми з вами звяжемось', // дані надіслані успішно
            failure: 'Щось пішло не так'//якщо помилка
    };
    forms.forEach(item => {
        bindPostData(item);//застосовуємо функцію відправки форми до усхіх форм
    });

    const postData = async (url, data) => {//функція відправки даних на сервер, яка приймає  
        const res = await fetch(url, {//адресу обробника на сервері і дані
            method: 'POST',//метод
            headers: {'Content-type': 'application/json'},//заголовки
            body: data//тіло даних
            
        });//повертаємо відповідь
        return await res.json();//читаємо відповідь в форматі json (розшифровуємо)
    };

    function bindPostData(form){//створюємо функцію відправки форми
        form.addEventListener('submit',  (event) => {
            event.preventDefault();
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);//дані з форми для відправки
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            //

            postData('http://localhost:3000/requests', json)//застосовуємо функцію 
                .then(data => {
                console.log(data);//виводим в консоль дані які вертаються з проміса
                showThanksModal(message.success);
                statusMessage.remove();
                })
            .catch(() =>{//у випадку помилки
                    showThanksModal(message.failure);
            })
            .finally(() => {
                    form.reset();// стераємо з форми введені дані
            });
        });
    }



    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML= `
        <div class = "modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    
    //SLIDER
    let offset = 0;//відступ
    let slideIndex = 1;//початковий (поточний) номер слайда

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),//додали слайдер
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.offer__slider-inner');

        if(slides.length < 10) {
            total.textContent = `0${slides.length}`;
            current.textContent = `0${slideIndex}`;
        } else {
            total.textContent = slides.length;
            current.textContent = slideIndex;
        }

        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = 'flex';
        slidesField.style.transition = '1s all';
        slidesWrapper.style.overflow = 'hidden';
     
        
        slides.forEach((slide) => {
            slide.style.width = width;
        });

        slider.style.position = 'relative';
        // елементи, які абсолютно спозиціоновані всередині слайда будуть нормально відображатись
        //створюємо обгортку для крапок
        const indicators = document.createElement('ol');
        const dots = [];// додали пустий масивв
        indicators.classList.add('carousel-indicators');
        indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
        `;
        slider.append(indicators);

        for(let i = 0; i < slides.length; i++){
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1);
            dot.style.cssText = `
                box-sizing: content-box;
                flex: 0 1 auto;
                width: 30px;
                height: 6px;
                margin-right: 3px;
                margin-left: 3px;
                cursor: pointer;
                background-color: #fff;
                background-clip: padding-box;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                opacity: .5;
                transition: opacity .6s ease;
            `;
            if(i == 0){
                dot.style.opacity = 1;
            }

            indicators.append(dot);
            dots.push(dot);
        }

        next.addEventListener('click', () => {
            if(offset == (+width.replace(/\D/g, '') * (slides.length - 1))){
                offset = 0;
            } else {
                offset += +width.replace(/\D/g, '');
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            if(slideIndex == slides.length){
                slideIndex = 1;
            } else {
                slideIndex++;
            }
            if(slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;

        });

        prev.addEventListener('click', () => {
            if(offset == 0){
                offset = +width.replace(/\D/g, '') * (slides.length - 1);
            } else {
                offset -= +width.replace(/\D/g, '');
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            if(slideIndex == 1){
                slideIndex = slides.length;
            } else {
                slideIndex--;
            }
            if(slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) =>{
                const slydeTo = e.target.getAttribute('data-slide-to');
                slideIndex = slydeTo;
                offset = +width.replace(/\D/g, '') * (slydeTo - 1);
                slidesField.style.transform = `translateX(-${offset}px)`;
                
                if(slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }

                dots.forEach(dot => dot.style.opacity = '.5');
                dots[slideIndex - 1].style.opacity = 1;

            });
        });

    //calculator
    const result = document.querySelector('.calculating__result span');
    // бееремо елемент із текстом де виводиться кількість калорій
    //обявляємо перемінні статі, росту, ваги, віку та коф.фізичної активності
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {//перевіряємо чи є в локало стораджу дані про стать
        sex = localStorage.getItem('sex');//якщо є дані про стать заносим їх в перемінну sex
    } else {//якщо немає то присовюємо стать - жіночу і вносим в локал сторажд
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {//перевіряємо чи є в локало стораджу дані про коф.фіз.актив
        ratio = localStorage.getItem('ratio');//якщо є даніпро коф.фіз.актив заносим їх в перемінну ratio
    } else {//якщо немає то присовюємо  коф.фіз.актив - 1.375 і вносим в локал сторажд
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal() {//створюємо функцію підрахунку калорій
        if (!sex || !height || !weight || !age || !ratio) {// перевіряєм якщо не введено хочаб один 
            result.textContent = '***';// із параметрів виводимо текст
            return;// завершуєм виконання функції
        }
        if (sex === 'female') {//якщо у перемій стать - жіноча - одна формула
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {/// в іншому разі - пдірахунок по формулі для чоловіків
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();// викликаємо функцію підрахунку

    function initLocalSettings(selector, activeClass) {// функція початкових параметрів для статі і коф.фіз.акт
        const elements = document.querySelectorAll(selector);// берем універсально діви і того і того

        elements.forEach(elem => {// перебираєм
            elem.classList.remove(activeClass);//прибираємо всі класи активності
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);// додаємо клас активності елементу у якого атрибут співпадає з 
            }// даними для статі в локал сторедж
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);// додаємо клас активності елементу дата атрибут якого співпадає з 
            }// даними для активності в локал сторедж
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');//застосовуємо функції початкових парам для статі
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');// для фіз активності

    function getStaticInformation(selector, activeClass) {// функц отримання даних від користувача
        const elements = document.querySelectorAll(selector);// вибираємо універ інпути статі і коф.
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {// при натисканні
                if (e.target.getAttribute('data-ratio')) {//якщо вибрано атрибут data-ratio
                    ratio = +e.target.getAttribute('data-ratio');// то передаєм його дані в перемінну 
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));//і записуєм в локал сторедж
                } else {
                    sex = e.target.getAttribute('id');//стать = дані з атрибуту id
                    localStorage.setItem('sex', e.target.getAttribute('id'));//записуєм дані про стать в локал сторедж
                }
                    elements.forEach(elem => {//у всых прибираємо клас активності і додаємо його у вибраний елемент
                    elem.classList.remove(activeClass);
                });
                    e.target.classList.add(activeClass);
    
                calcTotal();// застосовуємо функцію підрахунку щоб дані оновлювались
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');// застосов фукцію отрим для статі
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    //// застосов фукцію отрим для коефіцієнту


    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {//якщо введено не числове значення 
                input.style.border = "1px solid red";//додається червона рамка
            } else {//якщо числове то нічого не додається
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')) {
                case "height"://через кейс заносим дані які введені в ід відповідним перемінним
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();// застосовуємо функцію підрахунку щоб дані оновлювались
        });
    }

    getDynamicInformation('#height');//застосовуємо функцію для кожного поля
    getDynamicInformation('#weight');
    getDynamicInformation('#age');



});

