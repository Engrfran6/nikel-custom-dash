"use client";

import {useState} from "react";
import {
  Copy,
  Share2,
  ChevronRight,
  Plus,
  Download,
  ArrowLeftRight,
  User,
  MoreHorizontal,
  CreditCard,
  Wallet,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ─── Brand colors ───────────────────────────────────────────────────────────
const NAVY = "#1C3160";
const ORANGE = "#F5631D";
const GREEN = "#25C97A";

// ─── Data ────────────────────────────────────────────────────────────────────
const USER = {
  name: "Fabio Di Costa",
  balance: 148.27,
  iban: "DE25 1001 0001 0700 5000 020151",
  bic: "FPEGDEB2XXX",
  bankName: "Nickel Bank",
  adresse: "Marktplatz 4, 55130 Mainz, Deutschland",
  bankleitzahl: "1001",
  filialcode: "0700",
  kontonummer: "5000020151",
  pruefziffer: "90",
};

interface TxItem {
  id: number;
  initials: string;
  name: string;
  time: string;
  desc: string;
  amount: number;
}

interface TxGroup {
  date: string;
  items: TxItem[];
}

const TRANSACTIONS: TxGroup[] = [
  {
    date: "Montag, 29. Juni",
    items: [
      {
        id: 3,
        initials: "CL",
        name: "Einkauf",
        time: "12:54",
        desc: "Lebensmitteleinkauf",
        amount: -88.29,
      },
    ],
  },
  {
    date: "Mittwoch, 17. Juni",
    items: [
      {
        id: 2,
        initials: "TK",
        name: "Einkauf",
        time: "12:58",
        desc: "Lebensmitteleinkauf",
        amount: -31.0,
      },
      {
        id: 5,
        initials: "SP",
        name: "Einkauf",
        time: "09:12",
        desc: "Lebensmitteleinkauf",
        amount: -29.9,
      },
    ],
  },
  {
    date: "Mittwoch, 3. Juni",
    items: [
      {
        id: 4,
        initials: "MM",
        name: "EINZAHLUNG VON JEMANDEM",
        time: "12:44",
        desc: "Eine Sofortüberweisung erhalten",
        amount: 300.0,
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtAmount(n: number, showSign = false) {
  const abs = Math.abs(n).toFixed(2).replace(".", ",");
  const parts = abs.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formatted = parts.join(",") + " €";
  if (showSign && n > 0) return "+ " + formatted;
  if (n < 0) return "– " + formatted;
  return formatted;
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({initials, size = 40}: {initials: string; size?: number}) {
  if (!initials) {
    return (
      <div
        className="rounded-full flex items-center justify-center border-2 flex-shrink-0"
        style={{
          width: size,
          height: size,
          borderColor: "#d1d5db",
          background: "#fff",
        }}>
        <div className="flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                background: "#9ca3af",
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold"
      style={{
        width: size,
        height: size,
        background: "#f8f9fb",
        fontSize: size * 0.3,
        color: NAVY,
      }}>
      {initials}
    </div>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────
type Screen = "konto" | "karte" | "transfer" | "profil" | "menu";

function BottomNav({active, onNav}: {active: Screen; onNav: (s: Screen) => void}) {
  const items: {id: Screen; label: string; icon: React.ReactNode}[] = [
    {
      id: "konto",
      label: "KONTO",
      icon: <Wallet size={22} />,
    },
    {
      id: "karte",
      label: "KARTE",
      icon: <CreditCard size={22} />,
    },
    {
      id: "transfer",
      label: "ÜBERWEISUNG",
      icon: <ArrowLeftRight size={22} />,
    },
    {
      id: "profil",
      label: "PROFIL",
      icon: <User size={22} />,
    },
    {
      id: "menu",
      label: "MENÜ",
      icon: <MoreHorizontal size={22} />,
    },
  ];

  return (
    <nav className="flex border-t" style={{borderColor: "#e5e7eb", background: "#fff"}}>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            style={{color: isActive ? ORANGE : "#9ca3af"}}>
            {item.icon}
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────
function HomeScreen() {
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{background: NAVY}}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <p className="text-white text-base font-medium mb-1">{USER.name}</p>
        <div className="flex items-center justify-between">
          <p className="text-white font-bold" style={{fontSize: 34, letterSpacing: "-0.5px"}}>
            {fmtAmount(USER.balance)}
          </p>

          <div className="flex items-center gap-1 px-3 py-1.5 ">
            <span
              style={{fontSize: 13, background: ORANGE}}
              className="flex items-center justify-center rounded-full h-4 w-4">
              <Plus size={10} />
            </span>
            <button className="font-semibold text-white" style={{fontSize: 13}}>
              <span>Geld einzahlen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto rounded-t-3xl -mt-3 relative"
        style={{background: "#f8f9fb"}}>
        {/* Section header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-base" style={{color: "#111827"}}>
              Kontobewegungen
            </span>
            <Download size={15} color="#6b7280" />
          </div>
          <button
            className="font-medium underline underline-offset-2"
            style={{color: NAVY, fontSize: 13}}>
            Meine Kontoauszüge
          </button>
        </div>

        {/* Transaction groups */}
        {TRANSACTIONS.map((group) => (
          <div key={group.date}>
            <p className="px-5 py-2" style={{fontSize: 12, color: "#9ca3af", fontWeight: 500}}>
              {group.date}
            </p>
            <div className="mx-4 rounded-2xl overflow-hidden" style={{background: "#fff"}}>
              {group.items.map((tx, idx) => (
                <div key={tx.id}>
                  {idx > 0 && <div className="mx-4" style={{height: 1, background: "#e5e7eb"}} />}
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50">
                    <Avatar initials={tx.initials} size={42} />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold truncate"
                        style={{fontSize: 14, color: "#111827"}}>
                        {tx.name}
                      </p>
                      <p className="mt-0.5" style={{fontSize: 12, color: "#6b7280"}}>
                        {tx.time} • {tx.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: 14,
                          color: tx.amount > 0 ? GREEN : "#111827",
                        }}>
                        {tx.amount > 0 ? fmtAmount(tx.amount) : fmtAmount(tx.amount)}
                      </span>
                      <ChevronRight size={15} color="#d1d5db" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="h-6" />
      </div>
    </div>
  );
}

// ─── Transfer Screen ──────────────────────────────────────────────────────────
function TransferScreen() {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [recipient, setRecipient] = useState("");

  function handleSend() {
    if (!iban || !amount || !recipient) return;
    setStep("confirm");
  }

  if (step === "done") {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-5 px-6">
        <div
          className="rounded-full flex items-center justify-center"
          style={{width: 72, height: 72, background: GREEN}}>
          <Check size={36} color="#fff" strokeWidth={3} />
        </div>
        <div className="text-center">
          <p className="font-bold text-xl" style={{color: "#111827"}}>
            Überweisung gesendet!
          </p>
          <p className="mt-1 text-sm" style={{color: "#6b7280"}}>
            {fmtAmount(parseFloat(amount.replace(",", ".")))} wurden erfolgreich überwiesen.
          </p>
        </div>
        <button
          onClick={() => {
            setStep("form");
            setIban("");
            setAmount("");
            setReference("");
            setRecipient("");
          }}
          className="mt-2 px-8 py-3 rounded-full font-semibold text-white"
          style={{background: NAVY}}>
          Neue Überweisung
        </button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="px-5 pt-8 pb-5" style={{background: NAVY}}>
          <button onClick={() => setStep("form")}>
            <ArrowLeft size={22} color="#fff" />
          </button>
          <p className="text-white font-semibold text-lg mt-3">Überweisung bestätigen</p>
        </div>

        <div className="flex-1 rounded-t-3xl -mt-3 bg-white px-5 pt-6">
          <div className="rounded-2xl overflow-hidden" style={{background: "#f8f9fb"}}>
            {[
              ["Empfänger", recipient],
              ["IBAN", iban],
              ["Betrag", fmtAmount(parseFloat(amount.replace(",", ".")))],
              ["Verwendungszweck", reference || "—"],
            ].map(([label, val], i, arr) => (
              <div key={label}>
                {i > 0 && <div style={{height: 1, background: "#e5e7eb", marginLeft: 16}} />}
                <div className="px-4 py-4">
                  <p style={{fontSize: 12, color: "#9ca3af", fontWeight: 500}}>{label}</p>
                  <p className="mt-0.5 font-semibold" style={{color: "#111827"}}>
                    {val}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-center" style={{color: "#9ca3af"}}>
            Bitte überprüfen Sie alle Angaben vor der Bestätigung.
          </p>

          <button
            onClick={() => setStep("done")}
            className="mt-6 w-full py-4 rounded-2xl font-semibold text-white"
            style={{background: ORANGE}}>
            Jetzt überweisen
          </button>
          <button
            onClick={() => setStep("form")}
            className="mt-3 w-full py-4 rounded-2xl font-semibold"
            style={{color: "#6b7280", background: "#f3f4f6"}}>
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{background: NAVY}}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <p className="text-white font-semibold text-lg">Überweisung</p>
        <p className="text-white/60 text-sm mt-1">
          Verfügbares Guthaben:{" "}
          <span className="text-white font-medium">{fmtAmount(USER.balance)}</span>
        </p>
      </div>

      <div className="flex-1 rounded-t-3xl -mt-3 bg-white px-5 pt-6 flex flex-col gap-4">
        {/* Recipient */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{color: "#374151"}}>
            Empfänger
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Vor- und Nachname"
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
            style={{
              background: "#f8f9fb",
              border: "1.5px solid #e5e7eb",
              color: "#111827",
            }}
          />
        </div>

        {/* IBAN */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{color: "#374151"}}>
            IBAN des Empfängers
          </label>
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value.toUpperCase())}
            placeholder="DE00 0000 0000 0000 0000 00"
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none font-mono"
            style={{
              background: "#f8f9fb",
              border: "1.5px solid #e5e7eb",
              color: "#111827",
            }}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{color: "#374151"}}>
            Betrag
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none pr-10"
              style={{
                background: "#f8f9fb",
                border: "1.5px solid #e5e7eb",
                color: "#111827",
              }}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold"
              style={{color: "#9ca3af"}}>
              €
            </span>
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{color: "#374151"}}>
            Verwendungszweck{" "}
            <span className="font-normal" style={{color: "#9ca3af"}}>
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="z.B. Miete Juni"
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
            style={{
              background: "#f8f9fb",
              border: "1.5px solid #e5e7eb",
              color: "#111827",
            }}
          />
        </div>

        {/* Transfer type selector */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{color: "#374151"}}>
            Überweisungsart
          </label>
          <div className="flex gap-2">
            {["Standard", "Sofortüberweisung"].map((t) => (
              <button
                key={t}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: t === "Standard" ? NAVY : "#f8f9fb",
                  color: t === "Standard" ? "#fff" : "#6b7280",
                  border: "1.5px solid",
                  borderColor: t === "Standard" ? NAVY : "#e5e7eb",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleSend}
          className="w-full py-4 rounded-2xl font-semibold text-white mb-2"
          style={{
            background: iban && amount && recipient ? ORANGE : "#d1d5db",
          }}
          disabled={!iban || !amount || !recipient}>
          Weiter
        </button>
      </div>
    </div>
  );
}

// ─── Profile / Settings Screen ─────────────────────────────────────────────
function ProfileScreen({setScreen}: {setScreen: (value: Screen) => void}) {
  const [copied, setCopied] = useState(false);

  function copyIban() {
    navigator.clipboard.writeText(USER.iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const rows: {label: string; value: string; action?: React.ReactNode}[] = [
    {
      label: "Kontoinhaber",
      value: USER.name,
      action: <Share2 size={18} color="#9ca3af" />,
    },
    {label: "BIC/Swift", value: USER.bic},
    {
      label: "IBAN",
      value: USER.iban,
      action: (
        <button onClick={copyIban}>
          {copied ? <Check size={18} color={GREEN} /> : <Copy size={18} color="#9ca3af" />}
        </button>
      ),
    },
    // {label: "Bank", value: USER.bankName},
    {label: "Adresse", value: USER.adresse},
    {label: "Bankleitzahl", value: USER.bankleitzahl},
    {label: "Filialcode", value: USER.filialcode},
    {label: "Kontonummer", value: USER.kontonummer},
    {label: "Prüfziffer", value: USER.pruefziffer},
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center px-5 py-6 bg-white border-b border-gray-400 relative">
        <ArrowLeft
          size={22}
          color="#111827"
          className="absolute left-5"
          onClick={() => setScreen("konto")}
        />
        <p className="text-black/90 text-sm mt-0.5 flex-1 text-center">Tus datos bancarios</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-6" style={{background: "#fff"}}>
        {/* Data rows */}
        <div className="px-4">
          <div className="rounded-2xl overflow-hidden" style={{background: "#f8f9fb"}}>
            {rows.map((row, idx) => (
              <div key={row.label}>
                {idx > 0 && (
                  <div
                    style={{
                      height: 1,
                      background: "#e5e7eb",
                      marginLeft: 16,
                    }}
                  />
                )}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex-1 min-w-0 pr-3">
                    <p
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontWeight: 600,
                      }}>
                      {row.label}
                    </p>
                    <p
                      className="mt-0.5 font-medium break-all"
                      style={{fontSize: 14, color: "#111827"}}>
                      {row.value}
                    </p>
                  </div>
                  {row.action && <div className="flex-shrink-0">{row.action}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings links */}
        <div className="px-4 mt-4">
          <div className="rounded-2xl overflow-hidden" style={{background: "#f8f9fb"}}>
            {[
              "Persönliche Daten",
              "Sicherheit & Datenschutz",
              "Benachrichtigungen",
              "Sprache & Region",
              "Hilfe & Support",
            ].map((item, idx) => (
              <div key={item}>
                {idx > 0 && <div style={{height: 1, background: "#e5e7eb", marginLeft: 16}} />}
                <button className="w-full flex items-center justify-between px-4 py-4 text-left">
                  <span className="font-medium text-sm" style={{color: "#111827"}}>
                    {item}
                  </span>
                  <ChevronRight size={16} color="#d1d5db" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mt-4 mb-8">
          <button
            className="w-full py-4 rounded-2xl font-semibold text-sm"
            style={{background: "#fff1ee", color: "#f5631d"}}>
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card Screen (placeholder) ───────────────────────────────────────────────
function CardScreen() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{background: NAVY}}>
      <div className="px-5 pt-8 pb-6">
        <p className="text-white font-semibold text-lg">Meine Karte</p>
      </div>
      <div className="flex-1 rounded-t-3xl -mt-3 bg-white flex flex-col items-center justify-center gap-4 px-6">
        {/* Card visual */}
        <div
          className="w-full rounded-2xl p-6 flex flex-col justify-between"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #2d4a8a 100%)`,
            height: 200,
          }}>
          <div className="flex justify-between items-start">
            <span className="text-white font-bold text-lg tracking-wide">nickel</span>
            <div className="flex gap-1">
              <div
                className="rounded-full opacity-80"
                style={{width: 24, height: 24, background: ORANGE}}
              />
              <div
                className="rounded-full opacity-60 -ml-2"
                style={{width: 24, height: 24, background: ORANGE}}
              />
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1 font-mono tracking-widest">
              •••• •••• •••• 4275
            </p>
            <p className="text-white font-semibold">{USER.name}</p>
            <p className="text-white/60 text-xs mt-1">Gültig bis 06/28</p>
          </div>
        </div>
        <p className="text-sm text-center" style={{color: "#9ca3af"}}>
          Ihre Nickel Mastercard ist aktiv und einsatzbereit.
        </p>
        <div className="w-full rounded-2xl overflow-hidden" style={{background: "#f8f9fb"}}>
          {["Karte sperren", "PIN anzeigen", "Limit verwalten"].map((item, idx) => (
            <div key={item}>
              {idx > 0 && <div style={{height: 1, background: "#e5e7eb", marginLeft: 16}} />}
              <button className="w-full flex items-center justify-between px-4 py-4 text-left">
                <span className="font-medium text-sm" style={{color: "#111827"}}>
                  {item}
                </span>
                <ChevronRight size={16} color="#d1d5db" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Menu Screen (placeholder) ───────────────────────────────────────────────
function MenuScreen() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{background: NAVY}}>
      <div className="px-5 pt-8 pb-6">
        <p className="text-white font-semibold text-lg">Menü</p>
      </div>
      <div className="flex-1 rounded-t-3xl -mt-3 bg-white px-4 pt-6">
        <div className="rounded-2xl overflow-hidden" style={{background: "#f8f9fb"}}>
          {[
            "Kontoauszüge",
            "Daueraufträge",
            "Lastschriften",
            "Steuerinformationen",
            "Empfehlungen",
            "Kontakt & Hilfe",
            "Rechtliche Informationen",
          ].map((item, idx) => (
            <div key={item}>
              {idx > 0 && <div style={{height: 1, background: "#e5e7eb", marginLeft: 16}} />}
              <button className="w-full flex items-center justify-between px-4 py-4 text-left">
                <span className="font-medium text-sm" style={{color: "#111827"}}>
                  {item}
                </span>
                <ChevronRight size={16} color="#d1d5db" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("konto");

  const screenMap: Record<Screen, React.ReactNode> = {
    konto: <HomeScreen />,
    karte: <CardScreen />,
    transfer: <TransferScreen />,
    profil: <ProfileScreen setScreen={setScreen} />,
    menu: <MenuScreen />,
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{background: "#e8eaf0", fontFamily: "'Inter', sans-serif"}}>
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: "100%",
          height: "100vh",
          background: "#f2f3f7",
        }}>
        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex flex-col">{screenMap[screen]}</div>

        {/* Bottom nav */}
        <BottomNav active={screen} onNav={setScreen} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
