import { Dialog, DialogTrigger, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { getLists } from "@/Service/http";
import { List } from "lucide-react";
import { useNavigate } from "react-router-dom";
type List = {
  _id: string;
  name: string;
  items: { name: string; quantity: number }[]; // אפשר גם לצמצם עוד אם לא צריך הכל
};
const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLists(accessToken, setAccessToken);
        console.log(res);
        setLists(res);
      } catch (err) {
        console.error("Error loading lists:", err);
      }
    };
    fetch();
  }, [accessToken]);
  const handleAddList = () => {
    if (!newListName.trim()) {
      setError(true);
      return;
    }
    // const newList = { name: newListName.trim(), count: 0 };
    // setLists([...lists, newList]);
    setNewListName("");
    setError(false);
    setOpen(false);
  };
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Lists</h1>
      <div className="flex justify-between items-center">
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button className="w-fit">
              Create new list
              <AddIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-medium mb-2">List Name</h2>
            <Input
              placeholder="לדוגמה: סופר פארם"
              value={newListName}
              onChange={(e) => {
                setNewListName(e.target.value);
                if (error && e.target.value.trim()) {
                  setError(false);
                }
              }}
              aria-invalid={error}
            />
            <Button className="mt-2 w-fit" onClick={handleAddList}>
              Create
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => (
          <Card key={list._id} className="cursor-pointer hover:shadow-md">
            <CardContent>
              <CardTitle>{list.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {list.items.length} items
              </p>
              <Button
                className="mt-2 w-fit"
                onClick={() => {
                  //להמשיך לסדר את המעבר לדף עם השליפה והכל
                  navigate(`/lists/${list._id}`);
                }}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
