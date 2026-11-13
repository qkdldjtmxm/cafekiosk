/* =========================================================
   Jazz Cafe 주문 키오스크 — 동작 (js/script.js)

      ★ STEP 번호 순서대로, 주석 아래에 코드를 직접 입력하세요.
      각 STEP 이 끝날 때마다 브라우저에서 새로고침하여 확인합니다.

   목차 (완성했을 때의 구역)
     1. 요소 선택
     2. 데이터 (menus, cart 와 상태 값)
     3. 도움 함수 (won, findMenu, 합계 계산)
     3-2. 저장하기 / 불러오기 (saveState, loadState)
     4. 장바구니 데이터를 바꾸는 함수 (addToCart, changeQty, removeFromCart)
     5. 화면 그리기 (renderTabs, renderMenu, renderPlace, renderCart)
     6. 이벤트 (매장/포장, 전체 취소, 주문하기, 주문 완료 창 닫기)
     7. 처음 화면 그리기

   핵심 구조 (To-do List 와 같은 방식)
     1) 데이터(배열)가 '진짜 데이터'이다.  → menus, cart
     2) 데이터가 바뀌면 render 함수를 다시 부른다.
     3) 이벤트(클릭)는 '데이터만 바꾸고' 화면은 render 에게 맡긴다.
     4) 데이터가 바뀔 때마다 localStorage 에 저장한다.  → saveState()
   ========================================================= */


/* ---------------------------------------------------------
   1. 요소 선택
   --------------------------------------------------------- */

const tabsBox = document.querySelector('.tabs');
const menuGrid = document.querySelector('.menu-grid');
const cartList = document.querySelector('.cart-list');
const emptyMsg = document.querySelector('.empty-msg');
const totalPriceText = document.querySelector('.total-price');
const totalCountText = document.querySelector('.total-count');
const clearBtn = document.querySelector('.clear-btn');
const orderBtn = document.querySelector('.order-btn');

const modal = document.querySelector('.modal');
const modalPlace = document.querySelector('.modal-place');
const modalNumber = document.querySelector('.modal-number');
const receipt = document.querySelector('.receipt');
const modalTotal = document.querySelector('.modal-total');
const modalClose = document.querySelector('.modal-close');

// 여러 개를 한꺼번에 찾을 때는 querySelectorAll 을 사용.
// 매장 / 포장 버튼 2개
const placeBtns = document.querySelectorAll('.place-btn');



/* ---------------------------------------------------------
   2. 데이터
   --------------------------------------------------------- */

// ★ STEP 2. 카테고리 이름 배열 categories 를 만드세요.
//   ['커피', '논커피', '디저트']
const categories = ['커피', '논커피', '디저트'];

// ★ STEP 2. 메뉴판 배열 menus 를 만드세요. (객체 배열)
//   객체 모양: { id: 번호, name: '이름', price: 가격, category: '분류', icon: '이모지' }
//   - 커피 5개, 논커피 4개, 디저트 4개 (총 13개)
//   - id 는 1부터 차례로, 겹치지 않게 합니다.
//   - 메뉴 이름·가격·이모지는 자유롭게 정해도 됩니다.
const menus = [
   { id: 1,  name: '아메리카노',   price: 3000, category: '커피',   icon: '☕' },
   { id: 2,  name: '카페라떼',     price: 3500, category: '커피',   icon: '🥛' },
   { id: 3,  name: '바닐라라떼',   price: 4000, category: '커피',   icon: '🍦' },
   { id: 4,  name: '카푸치노',     price: 3800, category: '커피',   icon: '☁️' },
   { id: 5,  name: '콜드브루',     price: 4200, category: '커피',   icon: '🧊' },

   { id: 6,  name: '초코라떼',     price: 4000, category: '논커피', icon: '🍫' },
   { id: 7,  name: '녹차라떼',     price: 4300, category: '논커피', icon: '🍵' },
   { id: 8,  name: '딸기스무디',   price: 4800, category: '논커피', icon: '🍓' },
   { id: 9,  name: '자몽에이드',   price: 4500, category: '논커피', icon: '🍊' },

   { id: 10, name: '치즈케이크',   price: 5500, category: '디저트', icon: '🍰' },
   { id: 11, name: '크루아상',     price: 3200, category: '디저트', icon: '🥐' },
   { id: 12, name: '초코쿠키',     price: 2800, category: '디저트', icon: '🍪' },
   { id: 13, name: '벨기에 와플',  price: 6000, category: '디저트', icon: '🧇' }
];


// ★ STEP 2. 상태 값(바뀌는 값)을 let 으로 만드세요.
let currentCategory = '커피';   // 지금 선택된 카테고리

// ★ STEP 4. 장바구니 배열을 let 으로 만드세요.
let cart = [];          // 장바구니: { id: 메뉴번호, qty: 수량 } 객체의 배열

// ★ STEP 8. 매장/포장 값을 let 으로 만드세요.
let place = '매장';      // 매장 / 포장

// ★ STEP 9. 주문번호를 let 으로 만드세요.
let orderNo = 1;        // 다음 주문번호



/* ---------------------------------------------------------
   3. 도움 함수
   --------------------------------------------------------- */

// ★ STEP 2. won(number) 함수
//   숫자를 받아서 '3,000원' 모양의 글자를 돌려줍니다.
function won(number) {
   return number.toLocaleString('ko-KR') + '원';
}

// ★ STEP 2. findMenu(id) 함수
//   menus 배열에서 id 가 같은 메뉴 객체를 찾아 돌려줍니다.
function findMenu(id) {
   return menus.find((menu) => menu.id === id);
}

// ★ STEP 6. getTotalPrice() 함수 — 총 결제금액
function getTotalPrice() {
   let total = 0;
   cart.forEach((item) => {
      total += findMenu(item.id).price * item.qty;
   });
   return total;
}


// ★ STEP 6. getTotalCount() 함수 — 총 개수
function getTotalCount() {
   let count = 0;
   cart.forEach((item) => {
      count += item.qty;
   });
   return count;
}


/* ---------------------------------------------------------
   3-2. 저장하기 / 불러오기          ★ STEP 10 에서 작성
   --------------------------------------------------------- */

// ★ STEP 10. 저장 이름표 상수 STORAGE_KEY 를 만드세요.   예) 'cafe-kiosk-v1'
const STORAGE_KEY = 'cafe-kiosk-v1';


// ★ STEP 10. saveState() 함수
function saveState() {
   const state = {
      cart: cart,
      place: place,
      orderNo: orderNo
   };
   localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


// ★ STEP 10. loadState() 함수
function loadState() {
   const saved = localStorage.getItem(STORAGE_KEY);
   if (saved === null) {
      return;
   }
   try {
      const state = JSON.parse(saved);
      
      if (Array.isArray(state.cart)) {
         cart = state.cart.filter((item) => {
            return findMenu(item.id) !== undefined && item.qty > 0;  // 메뉴가 존재하고 수량이 0보다 큰 경우만 남긴다.
         });
      }
      if (state.place === '매장' || state.place === '포장') {
         place = state.place;
      }
      if (Number.isInteger(state.orderNo) && state.orderNo > 0) {
         orderNo = state.orderNo;
      }
   } catch (error) {}
}



/* ---------------------------------------------------------
   4. 장바구니 데이터를 바꾸는 함수 (화면은 건드리지 않는다)
   --------------------------------------------------------- */

// ★ STEP 4. addToCart(id) 함수 — 메뉴 담기
// 메뉴 담기: 이미 담겨 있으면 수량만 +1, 없으면 새로 넣는다.
function addToCart(id) {
   const found = cart.find((item) => item.id === id);
   if (found) {
      found.qty++;
   } else {
      cart.push({ id: id, qty: 1 });
   }
   renderCart();
   saveState();
}


// ★ STEP 5. changeQty(id, change) 함수 — 수량 늘리기/줄이기
function changeQty(id, change) {
   const found = cart.find((item) => item.id === id);
   found.qty += change;

   if (found.qty <= 0) {
      removeFromCart(id);
      return;
   }
   renderCart();
   saveState();
}


// ★ STEP 5. removeFromCart(id) 함수 — 삭제
function removeFromCart(id) {
   cart = cart.filter((item) => item.id !== id);
   renderCart();
   saveState();
}



/* ---------------------------------------------------------
   5. 화면 그리기 함수 (render)
   --------------------------------------------------------- */

// ★ STEP 3. renderTabs() 함수 — 카테고리 탭 그리기
function renderTabs() {
   tabsBox.innerHTML = '';

   categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('tab-btn');
      if (category === currentCategory) {
         btn.classList.add('active');       // 선택된 탭 표시
      }
      btn.textContent = category;

      btn.addEventListener('click', () => {
         currentCategory = category;        // 데이터를 바꾸고
         saveState();
         renderTabs();                      // 화면을 다시 그린다.
         renderMenu();
      });

      tabsBox.appendChild(btn);
   });
}


// ★ STEP 2. renderMenu() 함수 — 메뉴 카드 그리기
function renderMenu() {
   menuGrid.innerHTML = '';

   const shown = menus.filter((menu) => menu.category === currentCategory);

   shown.forEach((menu) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.classList.add('menu-card');

      const icon = document.createElement('span');
      icon.classList.add('menu-icon');
      icon.textContent = menu.icon;

      const name = document.createElement('span');
      name.classList.add('menu-name');
      name.textContent = menu.name;

      const price = document.createElement('span');
      price.classList.add('menu-price');
      price.textContent = won(menu.price);

      card.appendChild(icon);
      card.appendChild(name);
      card.appendChild(price);

      // 카드를 클릭하면 addToCart(메뉴 id) 가 실행된다.
      card.addEventListener('click', () => {
         addToCart(menu.id);
      });

      menuGrid.appendChild(card);
   });
}


// ★ STEP 8. renderPlace() 함수 — 매장/포장 버튼 모양 맞추기
// 매장 / 포장 버튼: 지금 선택된 place 에 맞게 모양(active)을 바꾼다.
function renderPlace() {
   placeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.place === place);
   });
}


// ★ STEP 4. renderCart() 함수 — 주문 내역 그리기
function renderCart() {
   cartList.innerHTML = '';

   cart.forEach((item) => {
      const menu = findMenu(item.id);

      const li = document.createElement('li');
      li.classList.add('cart-item');

      // 첫째 줄: 이름 / 금액
      const name = document.createElement('span');
      name.classList.add('cart-name');
      name.textContent = menu.icon + ' ' + menu.name;

      const sum = document.createElement('span');
      sum.classList.add('cart-sum');
      sum.textContent = won(menu.price * item.qty);

      // 둘째 줄: 수량 조절 / 삭제
      const qtyBox = document.createElement('div');
      qtyBox.classList.add('qty-box');

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.classList.add('qty-btn');
      minus.textContent = '-';
      minus.addEventListener('click', () => changeQty(item.id, -1));

      const qty = document.createElement('span');
      qty.classList.add('qty-num');
      qty.textContent = item.qty;

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.classList.add('qty-btn');
      plus.textContent = '+';
      plus.addEventListener('click', () => changeQty(item.id, 1));

      qtyBox.appendChild(minus);
      qtyBox.appendChild(qty);
      qtyBox.appendChild(plus);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.classList.add('remove-btn');
      remove.textContent = '삭제';
      remove.addEventListener('click', () => removeFromCart(item.id));

      li.appendChild(name);
      li.appendChild(sum);
      li.appendChild(qtyBox);
      li.appendChild(remove);
      
      cartList.appendChild(li);
   });

   //   ★ STEP 6. 목록을 그린 다음, 합계를 화면에 표시한다.
   // 합계 / 개수
   totalPriceText.textContent = won(getTotalPrice());
   totalCountText.textContent = '총 ' + getTotalCount() + '개';


   //   ★ STEP 7. 비어 있을 때의 처리
   const isEmpty = cart.length === 0;
   emptyMsg.classList.toggle('show', isEmpty);
   orderBtn.disabled = isEmpty;
   clearBtn.disabled = isEmpty;
}



/* ---------------------------------------------------------
   6. 이벤트
   --------------------------------------------------------- */

// ★ STEP 7. 전체 취소 버튼 클릭
// 전체 취소
clearBtn.addEventListener('click', () => {
   cart = [];
   renderCart();
   saveState();
});


// ★ STEP 8. 매장/포장 버튼 클릭
placeBtns.forEach((btn) => {
   btn.addEventListener('click', () => {
      place = btn.dataset.place;
      renderPlace(); 
      saveState();
   });
});


// ★ STEP 9. 주문하기 버튼 클릭  (순서가 중요합니다!)
// 주문하기: 주문 완료 창에 영수증을 만들어 보여 준다.
orderBtn.addEventListener('click', () => {
   if (cart.length === 0) {
      return;
   }

   modalPlace.textContent = place === '매장' ? '매장에서 드십니다' : '포장 주문입니다';
   modalNumber.textContent = String(orderNo).padStart(3, '0');  // 주문번호 3자리로 맞추기

   // 영수증 만들기
   receipt.innerHTML = '';
   cart.forEach((item) => {
      const menu = findMenu(item.id);
      const li = document.createElement('li');
      
      const left = document.createElement('span');
      left.textContent = menu.name + ' x ' + item.qty ;
      const right = document.createElement('span');
      right.textContent = won(menu.price * item.qty);

      li.appendChild(left);
      li.appendChild(right);
      receipt.appendChild(li);
   });
   modalTotal.textContent = '총 결제금액 ' + won(getTotalPrice());

   modal.classList.add('show');

   orderNo++;      // 다음 주문번호를 위해 1 증가
   cart = [];      // 장바구니 비우기
   renderCart();   // 장바구니 화면 갱신
   saveState();    // 상태 저장
});


// ★ STEP 9. 주문 완료 창 닫기
// 주문 완료 창 닫기 (확인 버튼 / 바깥 어두운 곳 클릭  / ESC 키)
function closeModal() {
   modal.classList.remove('show');
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
   if (e.target === modal) {
      closeModal();
   }
});

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      closeModal();
   }
});



/* ---------------------------------------------------------
   7. 처음 화면 그리기
   --------------------------------------------------------- */

// ★ STEP 2~8. render 함수들을 한 번씩 호출한다. (순서대로)
loadState();
renderTabs();
renderMenu();
renderPlace();
renderCart();

