const COIN_BUNDLES = [
  { coins: 30,  price: 0.34, note: "Popular" },
  { coins: 65,  price: 0.74 },
  { coins: 100, price: 1.15, note: "Best value" },
  { coins: 200, price: 2.30 },
  { coins: 350, price: 3.99 },
  { coins: 700, price: 7.99 },
  { coins: 1000, price: 11.99 },
  { coins: 2000, price: 23.98 },
  { coins: "custom", price: 0 }
];

function computePerCoinRate() {
  const real = COIN_BUNDLES.filter(b => typeof b.coins === "number");
  const rates = real.map(b => b.price / b.coins);
  return rates.reduce((a,b)=>a+b,0)/rates.length;
}

const usernameInput=document.getElementById("username");
const startBtn=document.getElementById("startBtn");
const usernameHint=document.getElementById("usernameHint");
const coinsSection=document.getElementById("coinsSection");
const coinGrid=document.getElementById("coinGrid");
const customBox=document.getElementById("customBox");
const customCoinsInp=document.getElementById("customCoins");
const checkoutSection=document.getElementById("checkoutSection");
const summaryCoinsEl=document.getElementById("summaryCoins");
const summaryPriceEl=document.getElementById("summaryPrice");
const checkoutForm=document.getElementById("checkoutForm");
const formHint=document.getElementById("formHint");
const modal=document.getElementById("modal");
const modalLoading=document.getElementById("modalLoading");
const modalSuccess=document.getElementById("modalSuccess");
const closeModalBtn=document.getElementById("closeModal");
const successUserEl=document.getElementById("successUser");
const cardName=document.getElementById("cardName");
const cardNumber=document.getElementById("cardNumber");
const expMonth=document.getElementById("expMonth");
const expYear=document.getElementById("expYear");
const cvv=document.getElementById("cvv");

let selectedBundle=null;
let perCoinRate=computePerCoinRate();

function createCoinCard(bundle, idx){
  const div=document.createElement("button");
  div.type="button";div.className="coin";div.dataset.idx=idx;
  const isCustom=bundle.coins==="custom";
  const title=isCustom?"Custom":`${bundle.coins} Coins`;
  const price=isCustom?"—":`$${bundle.price.toFixed(2)}`;
  div.innerHTML=`
    <div class="coin-top">
      <img class="coin-icon" src="https://i.ibb.co/pr0Ww3nZ/image-1.png" alt="Coin" />
      <div class="coin-title">${title}</div>
    </div>
    <div class="coin-price">${price}</div>
    ${bundle.note?`<div class="badge">${bundle.note}</div>`:""}
    ${isCustom?`<div class="coin-note">Enter your own amount</div>`:""}
  `;
  div.addEventListener("click",()=>handleCoinSelect(idx));
  return div;
}

function renderCoinGrid(){coinGrid.innerHTML="";COIN_BUNDLES.forEach((b,i)=>coinGrid.appendChild(createCoinCard(b,i)));}
function handleCoinSelect(idx){
  [...coinGrid.children].forEach(c=>c.classList.remove("selected"));
  const el=coinGrid.querySelector(`[data-idx="${idx}"]`);if(el)el.classList.add("selected");
  const bundle=COIN_BUNDLES[idx];
  if(bundle.coins==="custom"){customBox.classList.remove("hidden");selectedBundle={coins:0,price:0,custom:true};updateSummary();customCoinsInp.focus();}
  else{customBox.classList.add("hidden");selectedBundle={coins:bundle.coins,price:bundle.price,custom:false};updateSummary();}
  checkoutSection.classList.remove("hidden");
}
function updateSummary(){
  if(!selectedBundle){summaryCoinsEl.textContent="—";summaryPriceEl.textContent="$0.00";return;}
  let coins=selectedBundle.coins,price=selectedBundle.price;
  if(selectedBundle.custom){const n=parseInt(customCoinsInp.value||"0",10);coins=isNaN(n)?0:Math.max(1,n);price=+(coins*perCoinRate).toFixed(2);selectedBundle.coins=coins;selectedBundle.price=price;}
  summaryCoinsEl.textContent=typeof coins==="number"?`${coins} Coins`:"Custom";
  summaryPriceEl.textContent=`$${price.toFixed(2)}`;
}
function requireUsername(){const u=usernameInput.value.trim();if(!u){usernameHint.classList.add("show");return false;}usernameHint.classList.remove("show");return true;}
function luhnCheck(num){const s=(num||"").replace(/\D/g,"");let sum=0,dbl=false;for(let i=s.length-1;i>=0;i--){let d=parseInt(s[i]);if(dbl){d*=2;if(d>9)d-=9;}sum+=d;dbl=!dbl;}return s.length>=12&&(sum%10===0);}
startBtn.addEventListener("click",()=>{if(!requireUsername())return;coinsSection.classList.remove("hidden");coinsSection.scrollIntoView({behavior:"smooth"});});
customCoinsInp.addEventListener("input",updateSummary);
checkoutForm.addEventListener("submit",e=>{
  e.preventDefault();
  const uOk=requireUsername();
  const hasSelection=!!selectedBundle&&(selectedBundle.custom?selectedBundle.coins>0:true);
  const fieldsOk=[cardName.value.trim(),cardNumber.value.trim(),expMonth.value.trim(),expYear.value.trim(),cvv.value.trim()].every(Boolean);
  const cardOK=luhnCheck(cardNumber.value);
  if(!uOk||!hasSelection||!fieldsOk||!cardOK){formHint.textContent=!cardOK?"Enter a valid demo card number (e.g. 4242 4242 4242 4242).":"Please complete all fields.";formHint.classList.add("show");return;}
  formHint.classList.remove("show");
  successUserEl.textContent=usernameInput.value.trim();
  modal.classList.remove("hidden");
  modalLoading.classList.remove("hidden");
  modalSuccess.classList.add("hidden");
  setTimeout(()=>{modalLoading.classList.add("hidden");modalSuccess.classList.remove("hidden");},1400);
});
closeModalBtn.addEventListener("click",()=>{modal.classList.add("hidden");checkoutForm.reset();selectedBundle=null;updateSummary();[...coinGrid.children].forEach(c=>c.classList.remove("selected"));customBox.classList.add("hidden");});
document.addEventListener("DOMContentLoaded",()=>{renderCoinGrid();updateSummary();});
