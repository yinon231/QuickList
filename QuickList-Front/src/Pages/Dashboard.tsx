import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { getLists } from "@/Service/http";
import { List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { deleteList, createList } from "@/Service/http";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type List = {
  _id: string;
  name: string;
  items: { name: string; quantity: number }[]; // אפשר גם לצמצם עוד אם לא צריך הכל
};
const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState<string>("");
  const [error, setError] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [selectedDialog, setSelectDialog] = useState<List | null>(null);
  const handleDeleteList = async (id: string) => {
    try {
      await deleteList(id, accessToken, setAccessToken, navigate);
      await fetchList();
      toast.success("List has been deleted successfully", {});
    } catch (err: any) {
      toast.error("List has not been deleted", {
        description: err.message,
      });
    }
  };
  const fetchList = async () => {
    try {
      const res = await getLists(accessToken, setAccessToken, navigate);
      setLists(res);
    } catch (err: any) {
      console.error("Error loading lists:", err);
    }
  };
  useEffect(() => {
    fetchList();
  }, [accessToken]);
  const handleAddList = async () => {
    if (!newListName.trim()) {
      setError(true);
      return;
    }
    try {
      await createList(
        newListName.trim(),
        accessToken,
        setAccessToken,
        navigate
      );
      await fetchList();
      setCreateDialogOpen(false);

      toast.success("List has been created successfully");
    } catch (err: any) {
      toast.error("List has not been deleted", { description: err.message });
    }
    setNewListName("");
    setError(false);
  };
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Lists</h1>
      <div className="flex justify-between items-center">
        <Dialog
          open={createDialogOpen}
          onOpenChange={(open) => setCreateDialogOpen(open)}
        >
          <DialogTrigger asChild>
            <Button className="w-fit">
              Create new list
              <AddIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>List Name</DialogTitle>
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
            <DialogFooter>
              <Button className="mt-2 w-fit" onClick={handleAddList}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists &&
          lists.map((list) => (
            <Card
              key={list._id}
              className="relative cursor-pointer hover:shadow-md"
            >
              <CardContent>
                <CardTitle>{list.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {list.items.length} items
                </p>

                <div className="flex justify-between">
                  <Button
                    className="mt-2 w-fit"
                    onClick={() => {
                      //להמשיך לסדר את המעבר לדף עם השליפה והכל
                      navigate(`/lists/${list._id}`);
                    }}
                  >
                    Open
                  </Button>
                  <Dialog
                    open={selectedDialog?._id === list._id}
                    onOpenChange={(isOpen) =>
                      setSelectDialog(isOpen ? list : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-2 text-red-600 hover:text-red-800 cursor-pointer"
                        title="delete list"
                      >
                        <Trash2 className="size-7" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogTitle>Delete List</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{selectedDialog?.name}"
                        list?
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (selectedDialog)
                                handleDeleteList(selectedDialog._id);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
export default Dashboard;
