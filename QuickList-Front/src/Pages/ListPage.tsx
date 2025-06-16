import { useState } from "react";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Card, CardContent, CardTitle, CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Trash2, Plus } from "lucide-react";

const ListPage = () => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [items, setItems] = useState({
    name: "סופר פארם",
    list: [
      { id: 1, name: "חלב", quantity: 2, checked: true },
      { id: 2, name: "ביצים", quantity: 12, checked: true },
    ],
  });
  const toggleChange = (id: number) => {
    setItems((prev) => ({
      ...prev,
      list: prev.list.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };
  const toggleDelete = (id: number) => {
    setItems((prev) => ({
      ...prev,
      list: prev.list.filter((item) => item.id !== id),
    }));
  };
  const handleAddItem = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setItems((prev) => ({
      ...prev,
      list: [
        ...prev.list,
        {
          id: Date.now(),
          name: name.trim(),
          quantity: quantity,
          checked: false,
        },
      ],
    }));
    setOpen(false);
    setError(false);
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
          <CardTitle className="text-xl">{items.name} List</CardTitle>
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
          {items.list.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border p-3 rounded-md shadow-sm hover:shadow transition"
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleChange(item.id)}
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
                onClick={() => toggleDelete(item.id)}
              >
                <Trash2 className=" text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="default" className="mt-2 w-fit ">
            save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default ListPage;
