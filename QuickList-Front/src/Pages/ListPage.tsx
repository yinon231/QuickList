import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Card, CardContent, CardTitle, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { getListById, updateList } from "@/Service/http";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";
type List = {
  _id: string;
  name: string;
  items: { _id: string; name: string; quantity: number; checked: boolean }[]; // אפשר גם לצמצם עוד אם לא צריך הכל
};

const ListPage = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [list, setList] = useState<List | null>(null);
  useEffect(() => {
    if (!id) return;
    const fetchList = async () => {
      try {
        const list = await getListById(
          id,
          accessToken,
          setAccessToken,
          navigate
        );
        setList(list);
        console.log(list);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchList();
  }, []);
  const toggleChange = (id: string) => {
    setList((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item._id === id ? { ...item, checked: !item.checked } : item
        ),
      };
    });
  };
  const changeQuantity = (id: string, newQuantity: number) => [
    setList((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        ),
      };
    }),
  ];
  const changeName = (id: string, newName: string) => {
    setList((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item._id === id ? { ...item, name: newName } : item
        ),
      };
    });
  };
  const toggleDelete = (id: string) => {
    setList((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.filter((item) => item._id !== id),
      };
    });
  };
  const handleAddItem = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setList((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            _id: Date.now().toString(),
            name: name.trim(),
            quantity: quantity,
            checked: false,
          },
        ],
      };
    });
    setOpen(false);
    setError(false);
  };
  const handleUpdate = async () => {
    try {
      if (!id || !list) return;
      const cleanedItems = list.items.map(({ _id, ...rest }) => rest);

      const updatedList = {
        name: list.name,
        items: cleanedItems,
      };
      console.log(updatedList);
      const res = await updateList(
        id,
        updatedList,
        accessToken,
        setAccessToken,
        navigate
      );
      setList(res);
      toast.success("List has been updated successfully");
    } catch (err: any) {
      console.log(err.message);
      toast.error("List has not been updated", {
        description: err.message,
      });
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {list && (
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-xl">{list?.name} List</CardTitle>
            <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
              <DialogTrigger asChild>
                <Button
                  className="mb-1"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="size-6 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add new item</DialogTitle>

                <Input
                  placeholder="לדוגמה: חלב"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error && e.target.value.trim()) {
                      setError(false);
                    }
                  }}
                  aria-invalid={error}
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <DialogFooter>
                  <Button className="mt-2 w-fit" onClick={handleAddItem}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {list.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border p-3 rounded-md shadow-sm hover:shadow transition"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleChange(item._id)}
                />
                <Input
                  onChange={(e) => changeName(item._id, e.target.value)}
                  value={item.name}
                  className="w-full max-w-xs"
                />
                <Input
                  type="number"
                  onChange={(e) =>
                    changeQuantity(item._id, Number(e.target.value))
                  }
                  value={item.quantity}
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8"
                  onClick={() => toggleDelete(item._id)}
                >
                  <Trash2 className=" text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              variant="default"
              className="mt-2 w-fit"
              onClick={handleUpdate}
            >
              save
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default ListPage;
