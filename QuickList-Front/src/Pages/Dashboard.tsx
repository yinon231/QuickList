import { Dialog, DialogTrigger, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import AddIcon from "@mui/icons-material/Add";
const Dashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Lists</h1>
      <div className="flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-fit">
              Create new list
              <AddIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-medium mb-2">List Name</h2>
            <Input placeholder="לדוגמה: סופר פארם" />
            <Button className="mt-2 w-fit">Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md">
          <CardContent>
            <CardTitle>סופר פארם</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">4 items</p>
            <Button
              className="mt-2 w-fit"
              // onClick={() => (window.location.href = `/lists/${list._id}`)}
            >
              Open
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
