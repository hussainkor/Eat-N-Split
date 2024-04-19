import { useState } from "react";

const friendsData = [
  {
    id: 1234,
    name: "Hussain",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
  {
    id: 5678,
    name: "Sharah",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 20,
  },
  {
    id: 9234,
    name: "Nathan",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: -10,
  },
];

function App() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [friendItem, setFriendItem] = useState(friendsData);
  const [isSelected, setIsSelected] = useState(null);

  function handleAddForm() {
    setIsAddFormOpen((isAddFormOpen) => !isAddFormOpen);
    setIsSelected(null);
  }

  function handleAddFriendData(item) {
    setFriendItem([...friendItem, item]);
    setIsAddFormOpen(false);
  }

  function handleSelected(friend) {
    setIsSelected((cur) => (cur?.id === friend.id ? null : friend));
    setIsAddFormOpen(false);
  }

  function handleSplitBill(value) {
    setFriendItem(
      friendItem.map((item) =>
        item.id === isSelected.id
          ? { ...item, balance: item.balance + value }
          : item
      )
    );
    setIsSelected(null);
  }

  return (
    <div className="split-bill-box">
      <div className="left-side">
        <FriendsList
          friendItem={friendItem}
          isSelected={isSelected}
          onSelected={handleSelected}
        />
        {isAddFormOpen && (
          <AddFriendForm onAddFriendData={handleAddFriendData} />
        )}
        <button onClick={handleAddForm}>
          {isAddFormOpen ? "Close" : "Add Friend"}
        </button>
      </div>
      <div className="right-side">
        {isSelected && (
          <SplitBillForm
            onSelected={isSelected}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

function FriendsList({ friendItem, onSelected, isSelected }) {
  return (
    <ul className="friend-list">
      {friendItem.map((friend) => (
        <Friends
          key={friend.name}
          friend={friend}
          onSelected={onSelected}
          isSelected={isSelected}
        />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelected, isSelected }) {
  const selected = isSelected?.id === friend.id;
  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.title} />
      <h3>
        {friend.name}{" "}
        <button onClick={() => onSelected(friend)}>
          {selected ? "Close" : "Select"}
        </button>
      </h3>
      <p className="green">
        {friend.balance > 0 && `${friend.name} owes you ${friend.balance}$`}
      </p>
      <p className="red">
        {friend.balance < 0 &&
          `You owe ${friend.name} ${Math.abs(friend.balance)}$`}
      </p>
      <p>{friend.balance === 0 && `You and ${friend.name} are even`}</p>
    </li>
  );
}

function AddFriendForm({ onAddFriendData }) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");

  function handleAddForm(e) {
    e.preventDefault();
    if (!friendName || !imageUrl) return;
    const id = Date.now();
    const newItem = {
      name: friendName,
      image: `${imageUrl}?=${id}`,
      balance: 0,
      id: id,
    };
    onAddFriendData(newItem);

    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddForm}>
      <div>
        <label>Friend Name</label>
        <input
          type="text"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        />
      </div>
      <div>
        <label>Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <div>
        <Button>Add</Button>
      </div>
    </form>
  );
}

function SplitBillForm({ onSelected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const forndExpense = bill - userExpense;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;
    onSplitBill(whoIsPaying === "user" ? forndExpense : -forndExpense);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <h3>Split a bill with {onSelected?.name}</h3>
      <div>
        <label>Bill Value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(+e.target.value)}
        />
      </div>
      <div>
        <label>Your Expense</label>
        <input
          type="text"
          value={userExpense}
          onChange={(e) =>
            setUserExpense(
              +e.target.value > bill ? userExpense : +e.target.value
            )
          }
        />
      </div>
      <div>
        <label>{onSelected?.name} Expense</label>
        <input type="text" disabled value={userExpense ? forndExpense : ""} />
      </div>
      <div>
        <label>Who is paying the bill?</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{onSelected?.name}</option>
        </select>
      </div>
      <div>
        <Button>Split Bill</Button>
      </div>
    </form>
  );
}

export default App;
