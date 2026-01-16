from roadmap.models import RoadmapNode, RoadmapEdge


def get_next_node(node_id: str):
    """
    Returns the next roadmap node based on directed edges.
    """
    edge = RoadmapEdge.objects.filter(source=node_id).first()

    if not edge:
        return None

    return RoadmapNode.objects.filter(
        node_id=edge.target,
        roadmap=edge.roadmap
    ).first()
