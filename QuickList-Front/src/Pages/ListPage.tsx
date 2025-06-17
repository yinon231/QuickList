import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Card, CardContent, CardTitle, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { getListById, updateList } from "@/Service/http";
type List = {
  _id: string;
  name: string;
  items: { _id: string; name: string; quantity: number; checked: boolean }[]; // אפשר גם לצמצם עוד אם לא צריך הכל
};

const ListPage = () => {
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
        const list = await getListById(id, accessToken, setAccessToken);
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
      const res = await updateList(
        id,
        updatedList,
        accessToken,
        setAccessToken
      );
      setList(res);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Dialog open={open}>
        <DialogContent>
          <h2 className="text-lg font-medium mb-2">Add new item</h2>
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
            defaultValue={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <Button className="mt-2 w-fit" onClick={handleAddItem}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-xl">{list?.name} List</CardTitle>
          <Button
            className="mb-1"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-6 text-primary" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {list &&
            list?.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border p-3 rounded-md shadow-sm hover:shadow transition"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleChange(item._id)}
                />
                <Input defaultValue={item.name} className="w-full max-w-xs" />
                <Input
                  type="number"
                  defaultValue={item.quantity}
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="icon"
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
    </div>
  );
};
export default ListPage;
