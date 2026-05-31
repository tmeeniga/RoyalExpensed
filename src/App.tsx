import {
  useState,
  useEffect,
  ReactNode,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const T = {
  bg: "#0a0500",
  bgDeep: "#060300",
  card: "#160b00",
  cardBorder: "#7a5a10",
  gold: "#c8960a",
  goldLight: "#f0c040",
  goldDim: "#7a5a10",
  maroon: "#5c0000",
  maroonMid: "#7a0000",
  saffron: "#d45f00",
  saffronLight: "#ff7b1a",
  cream: "#f0deb4",
  creamDim: "#a88a50",
  green: "#1a4d1a",
  greenLight: "#4caf50",
  greenBorder: "#2d6b2d",
  red: "#4d0a0a",
  redLight: "#e53935",
  redBorder: "#6b2020",
};

// Type definitions
interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  datetime: string;
  splitMode: "equal" | "custom";
  customShares?: { [memberName: string]: number };
}

interface Settlement {
  id: number;
  from: string;
  to: string;
  amount: number;
  datetime: string;
}

function RoyalDivider() {
  return (
    <div
      style={{
        textAlign: "center",
        color: T.goldDim,
        fontSize: 11,
        margin: "8px 0",
        letterSpacing: 2,
      }}
    >
      ✦ ❧ ✦
    </div>
  );
}

function RoyalCard({
  children,
  style = {},
  glow,
}: {
  children: ReactNode;
  style?: any;
  glow?: boolean;
}) {
  return (
    <div
      style={{
        background: T.card,
        border: `1.5px solid ${glow ? T.gold : T.cardBorder}`,
        borderRadius: 2,
        padding: "14px",
        marginBottom: "12px",
        position: "relative",
        boxShadow: glow
          ? `0 0 18px rgba(200,150,10,0.18)`
          : `0 2px 12px rgba(0,0,0,0.7)`,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 5,
          color: T.goldDim,
          fontSize: 9,
          lineHeight: 1,
        }}
      >
        ◈
      </span>
      <span
        style={{
          position: "absolute",
          top: 3,
          right: 5,
          color: T.goldDim,
          fontSize: 9,
          lineHeight: 1,
        }}
      >
        ◈
      </span>
      <span
        style={{
          position: "absolute",
          bottom: 3,
          left: 5,
          color: T.goldDim,
          fontSize: 9,
          lineHeight: 1,
        }}
      >
        ◈
      </span>
      <span
        style={{
          position: "absolute",
          bottom: 3,
          right: 5,
          color: T.goldDim,
          fontSize: 9,
          lineHeight: 1,
        }}
      >
        ◈
      </span>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  const bg = active ? color || T.saffron : "#1e1000";
  const borderC = active ? color || T.saffron : T.goldDim;
  return (
    <div
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 12,
        background: bg,
        color: active ? "white" : T.creamDim,
        border: `1px solid ${borderC}`,
        userSelect: "none",
        transition: "all 0.2s",
      }}
    >
      {label}
    </div>
  );
}

function RoyalInput({
  value,
  onChange,
  placeholder,
  type = "text",
  onKeyDown,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      onKeyDown={onKeyDown}
      style={
        {
          width: "100%",
          padding: "9px 12px",
          boxSizing: "border-box",
          background: "#100800",
          border: `1px solid ${T.goldDim}`,
          borderRadius: 2,
          color: T.cream,
          fontSize: 13,
          outline: "none",
          fontFamily: "Georgia, serif",
        } as any
      }
    />
  );
}

function SelectName({
  members,
  onSelect,
  onSaveMembers,
}: {
  members: string[];
  onSelect: (name: string) => void;
  onSaveMembers: (members: string[]) => void;
}) {
  const [newName, setNewName] = useState("");

  const add = () => {
    const n = newName.trim();
    if (!n || members.includes(n)) return;
    onSaveMembers([...members, n]);
    setNewName("");
  };

  return (
    <div
      style={{
        background: T.bgDeep,
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        color: T.cream,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          margin: "0 auto",
          height: 4,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          marginBottom: 28,
        }}
      />

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>⚜️</div>
        <div
          style={{
            color: T.goldLight,
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: 4,
            marginTop: 8,
          }}
        >
          🔱 हर हर महादेव 🔱
        </div>
        <div
          style={{
            color: T.creamDim,
            fontSize: 12,
            letterSpacing: 3,
            marginTop: 4,
          }}
        >
          Jalgar Sanga 🎣 🌊 Expenses
        </div>
        <div
          style={{
            color: T.goldDim,
            marginTop: 8,
            letterSpacing: 4,
            fontSize: 10,
          }}
        >
          ◈ ━━━━━━━━━━━━━ ◈
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 380 }}>
        <RoyalCard glow>
          <div
            style={{
              color: T.gold,
              textAlign: "center",
              marginBottom: 14,
              fontSize: 14,
              letterSpacing: 2,
            }}
          >
            👑 DECLARE THY NAME, NOBLE ONE
          </div>

          {members.length === 0 && (
            <div
              style={{
                color: T.creamDim,
                textAlign: "center",
                fontSize: 12,
                marginBottom: 12,
                opacity: 0.7,
              }}
            >
              No members yet. Add the first noble below.
            </div>
          )}

          {members.map((m: string) => (
            <div
              key={m}
              onClick={() => onSelect(m)}
              style={{
                padding: "11px 16px",
                marginBottom: 8,
                background: `linear-gradient(135deg, ${T.maroon}, ${T.maroonMid})`,
                border: `1px solid ${T.gold}`,
                borderRadius: 2,
                cursor: "pointer",
                color: T.cream,
                fontSize: 15,
                textAlign: "center",
                letterSpacing: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                transition: "all 0.2s",
              }}
            >
              👤 {m}
            </div>
          ))}

          <RoyalDivider />

          <div
            style={{
              color: T.creamDim,
              fontSize: 11,
              marginBottom: 6,
              letterSpacing: 1,
            }}
          >
            ADD NEW MEMBER TO THE CHAMBER:
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <RoyalInput
              value={newName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewName(e.target.value)
              }
              placeholder="Enter name..."
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && add()
              }
            />
            <button
              onClick={add}
              style={{
                padding: "9px 16px",
                background: T.saffron,
                border: "none",
                borderRadius: 2,
                color: "white",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              +
            </button>
          </div>
        </RoyalCard>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 380,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          marginTop: 20,
        }}
      />
    </div>
  );
}

function HomeTab({
  balances,
  myName,
  totalOwed,
  totalIOwe,
  onRecordPayment,
  settlements,
}: {
  balances: { [key: string]: number };
  myName: string;
  totalOwed: number;
  totalIOwe: number;
  onRecordPayment: (data: { from: string; to: string; amount: number }) => void;
  settlements: Settlement[];
}) {
  const entries = Object.entries(balances).sort(
    (a: any, b: any) => b[1] - a[1]
  );
  const [payModal, setPayModal] = useState<null | {
    person: string;
    amount: number;
  }>(null);
  const [customAmt, setCustomAmt] = useState("");

  const openPay = (person: string, amount: number) => {
    setCustomAmt(Math.abs(amount).toFixed(2));
    setPayModal({ person, amount });
  };

  const confirmPay = () => {
    const amt = parseFloat(customAmt);
    if (!amt || amt <= 0) return;
    const { person, amount } = payModal!;
    const from = amount > 0 ? person : myName;
    const to = amount > 0 ? myName : person;
    onRecordPayment({ from, to, amount: amt });
    setPayModal(null);
    setCustomAmt("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            background: T.green,
            border: `1.5px solid ${T.greenBorder}`,
            borderRadius: 2,
            padding: "14px",
            textAlign: "center",
            boxShadow: "0 0 12px rgba(76,175,80,0.1)",
          }}
        >
          <div
            style={{
              color: T.greenLight,
              fontSize: 10,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            💚 OWED TO YOU
          </div>
          <div
            style={{ color: T.greenLight, fontSize: 24, fontWeight: "bold" }}
          >
            ₹{totalOwed.toFixed(2)}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: T.red,
            border: `1.5px solid ${T.redBorder}`,
            borderRadius: 2,
            padding: "14px",
            textAlign: "center",
            boxShadow: "0 0 12px rgba(229,57,53,0.1)",
          }}
        >
          <div
            style={{
              color: T.redLight,
              fontSize: 10,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            ❤️ YOU OWE
          </div>
          <div style={{ color: T.redLight, fontSize: 24, fontWeight: "bold" }}>
            ₹{totalIOwe.toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          color: T.gold,
          fontSize: 11,
          letterSpacing: 3,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        ⚔️ CHAMBER DEBT REGISTRY ⚔️
      </div>

      {entries.length === 0 && (
        <div
          style={{
            color: T.creamDim,
            textAlign: "center",
            fontSize: 13,
            opacity: 0.6,
            marginTop: 40,
          }}
        >
          No members yet.
          <br />
          Add members in the Chamber tab.
        </div>
      )}

      {entries.map(([person, amount]: [string, number]) => {
        const owesMe = amount > 0.005;
        const iOwe = amount < -0.005;
        const settled = !owesMe && !iOwe;
        const bg = owesMe ? T.green : iOwe ? T.red : T.card;
        const border = owesMe
          ? T.greenBorder
          : iOwe
          ? T.redBorder
          : T.cardBorder;
        const amtColor = owesMe ? T.greenLight : iOwe ? T.redLight : T.creamDim;

        return (
          <div
            key={person}
            style={{
              background: bg,
              border: `1.5px solid ${border}`,
              borderRadius: 2,
              padding: "12px 14px",
              marginBottom: 8,
              boxShadow: owesMe
                ? "0 0 8px rgba(76,175,80,0.1)"
                : iOwe
                ? "0 0 8px rgba(229,57,53,0.1)"
                : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    color: T.cream,
                    fontSize: 15,
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  👤 {person}
                </div>
                <div
                  style={{
                    color: settled
                      ? T.greenLight
                      : owesMe
                      ? "#81c784"
                      : "#ef9a9a",
                    fontSize: 11,
                    marginTop: 3,
                  }}
                >
                  {settled
                    ? "✅ All settled"
                    : owesMe
                    ? "💚 Owes you"
                    : "❤️ You owe them"}
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                <div
                  style={{ color: amtColor, fontSize: 22, fontWeight: "bold" }}
                >
                  {settled ? "—" : `₹${Math.abs(amount).toFixed(2)}`}
                </div>
                {!settled && (
                  <div
                    onClick={() => openPay(person, amount)}
                    style={{
                      padding: "4px 12px",
                      fontSize: 11,
                      cursor: "pointer",
                      background: owesMe ? T.green : T.red,
                      border: `1px solid ${owesMe ? T.greenLight : T.redLight}`,
                      borderRadius: 20,
                      color: owesMe ? T.greenLight : T.redLight,
                      letterSpacing: 1,
                    }}
                  >
                    {owesMe ? "💰 Mark Received" : "💸 Mark Paid"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {settlements.length > 0 && (
        <>
          <RoyalDivider />
          <div
            style={{
              color: T.goldDim,
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            ✅ RECENT SETTLEMENTS
          </div>
          {settlements.slice(0, 5).map((s: Settlement) => {
            const dt = new Date(s.datetime);
            const iAmFrom = s.from === myName;
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 12px",
                  marginBottom: 6,
                  background: "#0d1a0d",
                  border: `1px solid ${T.greenBorder}`,
                  borderRadius: 2,
                  opacity: 0.85,
                }}
              >
                <div>
                  <div style={{ color: T.greenLight, fontSize: 12 }}>
                    {iAmFrom ? `You paid ${s.to}` : `${s.from} paid you`}
                  </div>
                  <div style={{ color: T.goldDim, fontSize: 10, marginTop: 2 }}>
                    🕐{" "}
                    {dt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    ·{" "}
                    {dt.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div
                  style={{
                    color: T.greenLight,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  ✅ ₹{s.amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </>
      )}

      {payModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div style={{ width: "100%", maxWidth: 320 }}>
            <RoyalCard glow>
              <div
                style={{
                  color: T.gold,
                  textAlign: "center",
                  fontSize: 14,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                {payModal.amount > 0
                  ? "💰 MARK PAYMENT RECEIVED"
                  : "💸 MARK PAYMENT MADE"}
              </div>
              <div
                style={{
                  color: T.cream,
                  textAlign: "center",
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {payModal.amount > 0 ? (
                  <>
                    <span style={{ color: T.goldLight }}>
                      {payModal.person}
                    </span>{" "}
                    paid you
                  </>
                ) : (
                  <>
                    You paid{" "}
                    <span style={{ color: T.goldLight }}>
                      {payModal.person}
                    </span>
                  </>
                )}
              </div>
              <div
                style={{
                  color: T.creamDim,
                  fontSize: 11,
                  marginBottom: 6,
                  letterSpacing: 1,
                }}
              >
                AMOUNT PAID (₹):
              </div>
              <input
                value={customAmt}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCustomAmt(e.target.value)
                }
                type="number"
                style={
                  {
                    width: "100%",
                    padding: "10px",
                    boxSizing: "border-box",
                    marginBottom: 14,
                    background: "#100800",
                    border: `1px solid ${T.gold}`,
                    borderRadius: 2,
                    color: T.goldLight,
                    fontSize: 20,
                    textAlign: "center",
                    fontFamily: "Georgia, serif",
                    outline: "none",
                  } as any
                }
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setPayModal(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontFamily: "Georgia, serif",
                    background: T.maroon,
                    border: `1px solid ${T.cardBorder}`,
                    borderRadius: 2,
                    color: T.cream,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPay}
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontFamily: "Georgia, serif",
                    background: `linear-gradient(135deg, ${T.green}, #2d5a1a)`,
                    border: `1px solid ${T.greenLight}`,
                    borderRadius: 2,
                    color: T.greenLight,
                    cursor: "pointer",
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  ✅ Confirm
                </button>
              </div>
            </RoyalCard>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpensesTab({
  expenses,
  members,
  myName,
  onSave,
}: {
  expenses: Expense[];
  members: string[];
  myName: string;
  onSave: (expenses: Expense[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(myName);
  const [participants, setParticipants] = useState<string[]>([]);
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [customShares, setCustomShares] = useState<{
    [memberName: string]: number;
  }>({});
  const [splitError, setSplitError] = useState("");

  useEffect(() => {
    setParticipants([...members]);
    setPaidBy(myName);
    setSplitMode("equal");
    setCustomShares({});
    setSplitError("");
  }, [members, myName]);

  const toggleP = (m: string) => {
    const newParticipants = participants.includes(m)
      ? participants.filter((x) => x !== m)
      : [...participants, m];
    setParticipants(newParticipants);
    if (splitMode === "custom") {
      const newShares = { ...customShares };
      if (!newParticipants.includes(m)) {
        delete newShares[m];
      } else {
        newShares[m] = 0;
      }
      setCustomShares(newShares);
      setSplitError("");
    }
  };

  const selectAll = () => setParticipants([...members]);
  const clearAll = () => setParticipants([]);

  const updateCustomShare = (member: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomShares({
      ...customShares,
      [member]: numValue,
    });
    setSplitError("");
  };

  const validateCustomSplit = (): boolean => {
    const a = parseFloat(amount);
    const total = Object.values(customShares).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(total - a) > 0.01) {
      setSplitError(
        `Total (₹${total.toFixed(2)}) must equal expense amount (₹${a.toFixed(
          2
        )})`
      );
      return false;
    }
    return true;
  };

  const addExpense = () => {
    const a = parseFloat(amount);
    if (!desc.trim() || !a || participants.length === 0) return;

    if (splitMode === "custom" && !validateCustomSplit()) return;

    const newExp: Expense = {
      id: Date.now(),
      description: desc.trim(),
      amount: a,
      paidBy,
      participants: [...participants],
      datetime: new Date().toISOString(),
      splitMode,
      customShares: splitMode === "custom" ? { ...customShares } : undefined,
    };
    onSave([newExp, ...expenses]);
    setDesc("");
    setAmount("");
    setShowForm(false);
    setParticipants([...members]);
    setPaidBy(myName);
    setSplitMode("equal");
    setCustomShares({});
    setSplitError("");
  };

  const deleteExpense = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    onSave(expenses.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ color: T.gold, fontSize: 11, letterSpacing: 3 }}>
          📜 ROYAL EXPENSE SCROLL
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? T.maroon : T.saffron,
            border: "none",
            borderRadius: 2,
            color: "white",
            padding: "7px 16px",
            cursor: "pointer",
            fontSize: 12,
            letterSpacing: 1,
            fontFamily: "Georgia, serif",
          }}
        >
          {showForm ? "✕ CANCEL" : "+ ADD EXPENSE"}
        </button>
      </div>

      {showForm && (
        <RoyalCard glow>
          <div
            style={{
              color: T.gold,
              marginBottom: 12,
              fontSize: 12,
              letterSpacing: 2,
              textAlign: "center",
            }}
          >
            📋 RECORD IN THE ROYAL LEDGER
          </div>

          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                color: T.creamDim,
                fontSize: 11,
                marginBottom: 4,
                letterSpacing: 1,
              }}
            >
              WHAT WAS SPENT?
            </div>
            <RoyalInput
              value={desc}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDesc(e.target.value)
              }
              placeholder="e.g. Chicken feast, Cool drinks..."
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                color: T.creamDim,
                fontSize: 11,
                marginBottom: 4,
                letterSpacing: 1,
              }}
            >
              AMOUNT (₹)
            </div>
            <RoyalInput
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              placeholder="0.00"
              type="number"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                color: T.creamDim,
                fontSize: 11,
                marginBottom: 6,
                letterSpacing: 1,
              }}
            >
              PAID BY:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {members.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  active={paidBy === m}
                  onClick={() => setPaidBy(m)}
                  color={T.maroonMid}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div
                style={{ color: T.creamDim, fontSize: 11, letterSpacing: 1 }}
              >
                SPLIT AMONG:
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  onClick={selectAll}
                  style={{
                    color: T.saffronLight,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  All
                </span>
                <span
                  onClick={clearAll}
                  style={{ color: T.creamDim, fontSize: 11, cursor: "pointer" }}
                >
                  None
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {members.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  active={participants.includes(m)}
                  onClick={() => toggleP(m)}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                color: T.creamDim,
                fontSize: 11,
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              SPLIT TYPE:
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: T.cream,
                  fontSize: 12,
                }}
              >
                <input
                  type="radio"
                  checked={splitMode === "equal"}
                  onChange={() => {
                    setSplitMode("equal");
                    setSplitError("");
                  }}
                  style={{ cursor: "pointer" }}
                />
                Equal Split
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: T.cream,
                  fontSize: 12,
                }}
              >
                <input
                  type="radio"
                  checked={splitMode === "custom"}
                  onChange={() => {
                    setSplitMode("custom");
                    const shares: { [key: string]: number } = {};
                    participants.forEach((p) => {
                      shares[p] = 0;
                    });
                    setCustomShares(shares);
                    setSplitError("");
                  }}
                  style={{ cursor: "pointer" }}
                />
                Custom Split
              </label>
            </div>
          </div>

          {splitMode === "custom" && participants.length > 0 && (
            <div
              style={{
                marginBottom: 12,
                padding: "10px",
                background: "#1a0e00",
                borderRadius: 2,
                border: `1px solid ${T.goldDim}`,
              }}
            >
              <div
                style={{
                  color: T.gold,
                  fontSize: 11,
                  marginBottom: 8,
                  letterSpacing: 1,
                }}
              >
                CUSTOM SPLIT (₹):
              </div>
              {participants.map((p) => (
                <div
                  key={p}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 6,
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: T.cream, fontSize: 12, minWidth: 80 }}>
                    {p}
                  </div>
                  <input
                    type="number"
                    value={customShares[p] || 0}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateCustomShare(p, e.target.value)
                    }
                    placeholder="0.00"
                    style={
                      {
                        width: 80,
                        padding: "6px",
                        background: "#100800",
                        border: `1px solid ${T.goldDim}`,
                        borderRadius: 2,
                        color: T.goldLight,
                        fontSize: 12,
                        outline: "none",
                        fontFamily: "Georgia, serif",
                      } as any
                    }
                  />
                </div>
              ))}
              {splitError && (
                <div
                  style={{
                    color: T.redLight,
                    fontSize: 11,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  ⚠️ {splitError}
                </div>
              )}
            </div>
          )}

          {participants.length > 0 && amount && splitMode === "equal" && (
            <div
              style={{
                textAlign: "center",
                color: T.goldLight,
                fontSize: 12,
                padding: "8px",
                background: "#1a0e00",
                border: `1px solid ${T.goldDim}`,
                borderRadius: 2,
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              Each pays: ₹
              {(parseFloat(amount || "0") / participants.length).toFixed(2)}{" "}
              each
            </div>
          )}

          <button
            onClick={addExpense}
            style={{
              width: "100%",
              padding: "11px",
              fontFamily: "Georgia, serif",
              background: `linear-gradient(135deg, ${T.maroon}, ${T.saffron})`,
              border: `1px solid ${T.gold}`,
              borderRadius: 2,
              color: T.cream,
              cursor: "pointer",
              fontSize: 13,
              letterSpacing: 2,
            }}
          >
            ⚜️ RECORD IN ROYAL LEDGER
          </button>
        </RoyalCard>
      )}

      {expenses.length === 0 && !showForm && (
        <div
          style={{
            color: T.creamDim,
            textAlign: "center",
            opacity: 0.6,
            fontSize: 13,
            marginTop: 40,
          }}
        >
          📜 The royal scroll is empty.
          <br />
          Be the first to record an expense!
        </div>
      )}

      {expenses.map((exp) => {
        const share =
          exp.splitMode === "custom" && exp.customShares
            ? exp.customShares[myName] || 0
            : exp.amount / exp.participants.length;
        const iMePaid = exp.paidBy === myName;
        const imParticipant = exp.participants.includes(myName);
        const dt = new Date(exp.datetime);

        let myStatus = "";
        let myStatusColor = T.creamDim;
        if (iMePaid && !imParticipant) {
          myStatus = "You covered all";
          myStatusColor = T.greenLight;
        } else if (iMePaid && imParticipant) {
          myStatus = "You paid (incl. yourself)";
          myStatusColor = T.greenLight;
        } else if (!iMePaid && imParticipant) {
          myStatus = `You owe ₹${share.toFixed(2)}`;
          myStatusColor = T.redLight;
        } else {
          myStatus = "Not involved";
          myStatusColor = T.creamDim;
        }

        return (
          <RoyalCard key={exp.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: T.goldLight,
                    fontSize: 14,
                    fontWeight: "bold",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  🍽 {exp.description}
                </div>
                <div
                  style={{ color: T.creamDim, fontSize: 11, marginBottom: 2 }}
                >
                  💰 Paid by:{" "}
                  <span style={{ color: iMePaid ? T.greenLight : T.cream }}>
                    {exp.paidBy}
                  </span>
                </div>
                <div
                  style={{
                    color: T.creamDim,
                    fontSize: 10,
                    marginBottom: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {exp.splitMode === "custom" ? (
                    <>
                      <div style={{ color: T.goldLight, marginBottom: 4 }}>
                        💳 CUSTOM SPLIT:
                      </div>
                      {exp.participants.map((p) => {
                        const pShare = exp.customShares?.[p] || 0;
                        return (
                          <div key={p} style={{ paddingLeft: 8, fontSize: 10 }}>
                            {p}: ₹{pShare.toFixed(2)}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>👥 {exp.participants.join(" · ")}</>
                  )}
                </div>
                <div style={{ color: T.goldDim, fontSize: 10 }}>
                  🕐{" "}
                  {dt.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  ·{" "}
                  {dt.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div style={{ textAlign: "right", marginLeft: 10 }}>
                <div
                  style={{ color: T.gold, fontSize: 20, fontWeight: "bold" }}
                >
                  ₹{exp.amount.toFixed(2)}
                </div>
                <div style={{ color: T.creamDim, fontSize: 10 }}>
                  {exp.splitMode === "custom"
                    ? `Custom: ₹${share.toFixed(2)}`
                    : `÷${exp.participants.length} = ₹${share.toFixed(2)}`}
                </div>
                <div
                  style={{
                    color: myStatusColor,
                    fontSize: 10,
                    marginTop: 4,
                    maxWidth: 90,
                    textAlign: "right",
                  }}
                >
                  {myStatus}
                </div>
                <div
                  onClick={() => deleteExpense(exp.id)}
                  style={{
                    color: T.redLight,
                    fontSize: 18,
                    cursor: "pointer",
                    marginTop: 6,
                    textAlign: "right",
                  }}
                >
                  🗑
                </div>
              </div>
            </div>
          </RoyalCard>
        );
      })}

      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              background: "#1a0b00",
              border: "1px solid #b8860b",
              padding: 20,
              boxShadow: "0 0 20px rgba(184,134,11,0.4)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#d4af37",
                fontSize: 18,
                marginBottom: 15,
                fontWeight: "bold",
              }}
            >
              ⚠️ DELETE EXPENSE
            </div>

            <div
              style={{
                textAlign: "center",
                color: "#f5deb3",
                marginBottom: 20,
              }}
            >
              Remove this expense from the royal ledger?
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#3b1f00",
                  color: "#f5deb3",
                  border: "1px solid #b8860b",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#8b0000",
                  color: "white",
                  border: "1px solid #ff4444",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MembersTab({
  members,
  onSave,
}: {
  members: string[];
  onSave: (members: string[]) => void;
}) {
  const [newName, setNewName] = useState("");

  const add = () => {
    const n = newName.trim();
    if (!n || members.includes(n)) return;
    onSave([...members, n]);
    setNewName("");
  };

  const remove = (m: string) => {
    onSave(members.filter((x) => x !== m));
  };

  return (
    <div>
      <div
        style={{
          color: T.gold,
          fontSize: 11,
          letterSpacing: 3,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        👑 CHAMBER OF NOBLES
      </div>
      <RoyalCard>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <RoyalInput
            value={newName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
            placeholder="Add new noble..."
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && add()
            }
          />
          <button
            onClick={add}
            style={{
              padding: "9px 16px",
              background: T.saffron,
              border: "none",
              borderRadius: 2,
              color: "white",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            +
          </button>
        </div>
        <RoyalDivider />
        {members.length === 0 && (
          <div
            style={{
              color: T.creamDim,
              textAlign: "center",
              fontSize: 12,
              opacity: 0.6,
              marginTop: 8,
            }}
          >
            The chamber is empty. Add the first noble above.
          </div>
        )}
        {members.map((m) => (
          <div
            key={m}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 14px",
              marginBottom: 6,
              background: "#1a0d00",
              border: `1px solid ${T.goldDim}`,
              borderRadius: 2,
            }}
          >
            <div style={{ color: T.cream, fontSize: 14, letterSpacing: 1 }}>
              👤 {m}
            </div>
            <div
              onClick={() => remove(m)}
              style={{
                color: T.redLight,
                cursor: "pointer",
                fontSize: 20,
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ✕
            </div>
          </div>
        ))}
      </RoyalCard>
    </div>
  );
}

function PinScreen({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  const press = (d: string) => {
    if (d === "⌫") {
      setPin((p) => p.slice(0, -1));
      setError("");
      return;
    }
    if (d === "") return;
    if (pin.length >= 4) return;
    setPin((p) => p + d);
    setError("");
  };

  const unlock = async () => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setChecking(true);
    setError("");

    try {
      const pinRef = doc(db, "allowedPins", pin);
      const pinSnap = await getDoc(pinRef);

      if (!pinSnap.exists()) {
        setError("Wrong PIN");
        setChecking(false);
        return;
      }

      onUnlock(pin);
      return;
    } catch (err) {
      console.log(err);
      setError("Unable to verify PIN");
      setChecking(false);
    }
  };

  return (
    <div
      style={{
        background: T.bgDeep,
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        color: T.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          marginBottom: 32,
        }}
      />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 52, lineHeight: 1 }}>🔐</div>
        <div
          style={{
            color: T.goldLight,
            fontSize: 22,
            fontWeight: "bold",
            letterSpacing: 4,
            marginTop: 10,
          }}
        >
          🔱 हर हर महादेव 🔱
        </div>
        <div
          style={{
            color: T.creamDim,
            fontSize: 11,
            letterSpacing: 3,
            marginTop: 4,
          }}
        >
          Jalgar Sanga 🎣 🌊 Expenses
        </div>
        <div
          style={{
            color: T.goldDim,
            marginTop: 8,
            letterSpacing: 4,
            fontSize: 10,
          }}
        >
          ◈ ━━━━━━━━━━━━━ ◈
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 320 }}>
        <RoyalCard glow>
          <div
            style={{
              color: T.gold,
              textAlign: "center",
              fontSize: 13,
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            🔑 ENTER ROOM SECRET PIN
          </div>
          <div
            style={{
              color: T.creamDim,
              textAlign: "center",
              fontSize: 11,
              marginBottom: 16,
              lineHeight: 1.6,
            }}
          >
            All roommates must use the
            <br />
            same PIN to access the same room
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: i < pin.length ? T.gold : "transparent",
                  border: `2px solid ${i < pin.length ? T.gold : T.goldDim}`,
                  transition: "all 0.15s",
                  boxShadow:
                    i < pin.length ? `0 0 8px rgba(200,150,10,0.5)` : "none",
                }}
              />
            ))}
          </div>

          {error && (
            <div
              style={{
                color: T.redLight,
                textAlign: "center",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {digits.map((d, i) => (
              <div
                key={i}
                onClick={() => press(d)}
                style={{
                  padding: "16px 0",
                  textAlign: "center",
                  fontSize: d === "⌫" ? 20 : 22,
                  color:
                    d === "" ? "transparent" : d === "⌫" ? T.redLight : T.cream,
                  background: d === "" ? "transparent" : "#1e1000",
                  border: d === "" ? "none" : `1px solid ${T.goldDim}`,
                  borderRadius: 2,
                  cursor: d === "" ? "default" : "pointer",
                  fontFamily: "Georgia, serif",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <button
            onClick={unlock}
            disabled={pin.length < 4 || checking}
            style={
              {
                width: "100%",
                padding: "12px",
                fontFamily: "Georgia, serif",
                background:
                  pin.length >= 4
                    ? `linear-gradient(135deg, ${T.maroon}, ${T.saffron})`
                    : "#2a1500",
                border: `1px solid ${pin.length >= 4 ? T.gold : T.goldDim}`,
                borderRadius: 2,
                color: pin.length >= 4 ? T.cream : T.creamDim,
                cursor: pin.length >= 4 ? "pointer" : "not-allowed",
                fontSize: 13,
                letterSpacing: 2,
              } as any
            }
          >
            {checking ? "⟳ OPENING GATES..." : "⚜️ ENTER THE CHAMBER"}
          </button>

          <div
            style={{
              color: T.goldDim,
              textAlign: "center",
              fontSize: 10,
              marginTop: 12,
              lineHeight: 1.7,
            }}
          >
            Authorized users only
          </div>
        </RoyalCard>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 360,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          marginTop: 24,
        }}
      />
    </div>
  );
}

export default function App() {
  const [pin, setPin] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [myName, setMyName] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async (activePin: string) => {
    try {
      const docRef = doc(db, "rooms", activePin);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setMembers(data.members || []);
        setExpenses(data.expenses || []);
        setSettlements(data.settlements || []);
      } else {
        await setDoc(docRef, {
          members: [],
          expenses: [],
          settlements: [],
        });
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleUnlock = (enteredPin: string) => {
    if (selectedRoom && enteredPin !== selectedRoom) {
      alert("Wrong PIN");
      return;
    }

    setPin(enteredPin);
    setLoading(true);
    load(enteredPin);
  };

  useEffect(() => {
    if (!pin) return;

    const roomRef = doc(db, "rooms", pin);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setMembers(data.members || []);
        setExpenses(data.expenses || []);
        setSettlements(data.settlements || []);
      }
    });

    return () => unsubscribe();
  }, [pin]);

  const saveMembers = async (nm: string[]) => {
    setMembers(nm);

    const docRef = doc(db, "rooms", pin!);

    await setDoc(
      docRef,
      {
        members: nm,
        expenses,
        settlements,
      },
      { merge: true }
    );
  };

  const saveExpenses = async (ne: Expense[]) => {
    setSyncing(true);
    setExpenses(ne);

    const docRef = doc(db, "rooms", pin!);

    await setDoc(
      docRef,
      {
        members,
        expenses: ne,
        settlements,
      },
      { merge: true }
    );

    setSyncing(false);
  };

  const recordPayment = async ({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }) => {
    const newS: Settlement = {
      id: Date.now(),
      from,
      to,
      amount,
      datetime: new Date().toISOString(),
    };

    const updated = [newS, ...settlements];

    setSyncing(true);
    setSettlements(updated);

    const docRef = doc(db, "rooms", pin!);

    await setDoc(
      docRef,
      {
        members,
        expenses,
        settlements: updated,
      },
      { merge: true }
    );

    setTimeout(() => setSyncing(false), 800);
  };

  const getBalances = () => {
    if (!myName) return {};
    const bal: { [key: string]: number } = {};
    members.forEach((m) => {
      if (m !== myName) bal[m] = 0;
    });

    // Add expenses
    expenses.forEach((exp) => {
      if (exp.splitMode === "custom" && exp.customShares) {
        // Custom split mode
        if (exp.paidBy === myName) {
          Object.entries(exp.customShares).forEach(([participant, share]) => {
            if (participant !== myName && bal[participant] !== undefined) {
              bal[participant] += share;
            }
          });
        } else if (bal[exp.paidBy] !== undefined) {
          const myShare = exp.customShares[myName] || 0;
          if (myShare > 0) {
            bal[exp.paidBy] -= myShare;
          }
        }
      } else {
        // Equal split mode (default)
        const share = exp.amount / exp.participants.length;
        if (exp.paidBy === myName) {
          exp.participants.forEach((p) => {
            if (p !== myName && bal[p] !== undefined) bal[p] += share;
          });
        } else if (
          myName &&
          exp.participants.includes(myName) &&
          bal[exp.paidBy] !== undefined
        ) {
          bal[exp.paidBy] -= share;
        }
      }
    });

    // Apply settlements
    settlements.forEach((s) => {
      if (s.from === myName && bal[s.to] !== undefined) bal[s.to] += s.amount;
      else if (s.to === myName && bal[s.from] !== undefined)
        bal[s.from] -= s.amount;
    });

    return bal;
  };

  if (!selectedRoom) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/room-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "flex-start",
          position: "relative",
          paddingTop: "18vh",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(0px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 350,
            textAlign: "center",
            marginTop: 0,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 24,
              letterSpacing: 2,
              textShadow: "0 0 10px rgba(240,192,64,0.8)",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            🔱 हर हर महादेव 🔱
          </div>

          <div
            style={{
              color: "#f0c040",
              marginBottom: 30,
              letterSpacing: 2,
              fontSize: 13,
            }}
          >
            JALGAR SANGA EXPENSES
          </div>

          <button
            onClick={() => setSelectedRoom("9701")}
            style={{
              width: "100%",
              padding: "18px",
              marginBottom: 15,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.25)",
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(15px)",
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🏠 Room Expenses
          </button>

          <button
            onClick={() => setSelectedRoom("9392")}
            style={{
              width: "100%",
              padding: "22px",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.25)",
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(15px)",
              color: "#fff",
              fontSize: 20,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✈️ Trip Expenses
          </button>
        </div>
      </div>
    );
  }

  if (!pin) return <PinScreen onUnlock={handleUnlock} />;

  if (loading) {
    return (
      <div
        style={{
          background: T.bgDeep,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: T.gold,
        }}
      >
        <div style={{ fontSize: 48 }}>⚜️</div>
        <div style={{ fontSize: 16, marginTop: 12, letterSpacing: 3 }}>
          Opening Royal Ledger...
        </div>
        <div
          style={{
            color: T.goldDim,
            fontSize: 11,
            marginTop: 6,
            letterSpacing: 2,
          }}
        >
          ◈ ━━━━━━━ ◈
        </div>
      </div>
    );
  }

  if (!myName) {
    return (
      <SelectName
        members={members}
        onSelect={setMyName}
        onSaveMembers={saveMembers}
      />
    );
  }

  const balances = getBalances();
  const totalOwed = Object.values(balances)
    .filter((v) => v > 0)
    .reduce((a, b) => a + b, 0);
  const totalIOwe = Math.abs(
    Object.values(balances)
      .filter((v) => v < 0)
      .reduce((a, b) => a + b, 0)
  );
  const netBalance = totalOwed - totalIOwe;

  const TABS = [
    { id: "home", icon: "🏰", label: "Balances" },
    { id: "expenses", icon: "📜", label: "Expenses" },
    { id: "members", icon: "👑", label: "Chamber" },
  ];

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        color: T.cream,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: `linear-gradient(180deg, #1e0800, ${T.card})`,
          borderBottom: `2px solid ${T.gold}`,
          padding: "14px 16px 10px",
          textAlign: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: T.goldLight,
            fontSize: 18,
            fontWeight: "bold",
            letterSpacing: 4,
          }}
        >
          ⚜️ 🔱 हर हर महादेव 🔱 ⚜️
        </div>
        <div style={{ color: T.creamDim, fontSize: 10, letterSpacing: 3 }}>
          Jalgar Sanga 🎣 🌊 Expenses
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
          }}
        >
          <div
            style={{
              color: T.cream,
              fontSize: 12,
              letterSpacing: 1,
              background: T.maroon,
              padding: "3px 12px",
              border: `1px solid ${T.gold}`,
              borderRadius: 20,
            }}
          >
            👤 {myName}
          </div>
          <div
            onClick={() => setMyName(null)}
            style={{
              color: T.goldDim,
              fontSize: 11,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Change
          </div>
          <div
            onClick={() => {
              setPin(null);
              setSelectedRoom(null);
              setMyName(null);
              setMembers([]);
              setExpenses([]);
              setSettlements([]);
            }}
            style={{ color: T.redLight, fontSize: 11, cursor: "pointer" }}
            title="Lock app"
          >
            🔒
          </div>
          {syncing && (
            <div style={{ color: T.goldLight, fontSize: 10, letterSpacing: 1 }}>
              ⟳ Syncing...
            </div>
          )}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "4px 16px",
            background: netBalance >= 0 ? T.green : T.red,
            border: `1px solid ${
              netBalance >= 0 ? T.greenBorder : T.redBorder
            }`,
            borderRadius: 20,
            fontSize: 12,
            letterSpacing: 1,
            color: netBalance >= 0 ? T.greenLight : T.redLight,
          }}
        >
          {netBalance >= 0
            ? `💚 Net +₹${netBalance.toFixed(2)} in your favour`
            : `❤️ Net -₹${Math.abs(netBalance).toFixed(2)} you owe`}
        </div>
      </div>

      <div style={{ padding: "14px 14px 90px" }}>
        {tab === "home" && (
          <HomeTab
            balances={balances}
            myName={myName}
            totalOwed={totalOwed}
            totalIOwe={totalIOwe}
            onRecordPayment={recordPayment}
            settlements={settlements.filter(
              (s) => s.from === myName || s.to === myName
            )}
          />
        )}
        {tab === "expenses" && (
          <ExpensesTab
            expenses={expenses}
            members={members}
            myName={myName}
            onSave={saveExpenses}
          />
        )}
        {tab === "members" && (
          <MembersTab members={members} onSave={saveMembers} />
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: T.card,
          borderTop: `2px solid ${T.gold}`,
          display: "flex",
        }}
      >
        {TABS.map(({ id, icon, label }) => (
          <div
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              padding: "10px 0",
              textAlign: "center",
              cursor: "pointer",
              borderTop:
                tab === id ? `3px solid ${T.gold}` : "3px solid transparent",
              color: tab === id ? T.goldLight : T.creamDim,
              background: tab === id ? "#1e1000" : "transparent",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 9, letterSpacing: 2, marginTop: 2 }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
