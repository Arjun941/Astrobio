"use client";

import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { getMindmapAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';

const nodeDefaults = {
  sourcePosition: 'right',
  targetPosition: 'left',
  style: {
    borderRadius: '100%',
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    width: 150,
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '10px',
  },
};

export default function MindmapView({ paperUrl }: { paperUrl: string }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const handleGenerateMindmap = async () => {
    setIsLoading(true);
    const result = await getMindmapAction(paperUrl);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Generating Mindmap",
        description: result.error,
        variant: "destructive",
      });
    } else if ('mindmap' in result && result.mindmap) {
      setNodes(result.mindmap.nodes.map((node: Node) => ({...node, ...nodeDefaults})));
      setEdges(result.mindmap.edges);
      setIsGenerated(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Concept Mindmap</CardTitle>
      </CardHeader>
      <CardContent>
        {!isGenerated && !isLoading && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="mb-4 text-muted-foreground">Visualize the key concepts of this paper.</p>
            <Button onClick={handleGenerateMindmap}>Generate Mindmap</Button>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner />
            <p className="ml-4">Generating mindmap, this may take a moment...</p>
          </div>
        )}
        {isGenerated && (
          <div style={{ height: '600px' }} className="border rounded-md">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
